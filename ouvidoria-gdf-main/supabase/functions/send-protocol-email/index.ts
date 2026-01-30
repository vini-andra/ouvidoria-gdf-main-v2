import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SendProtocolRequest {
  email: string;
  protocolo: string;
  senha?: string;
}

interface EmailLog {
  email: string;
  protocolo: string;
  status: "success" | "failed";
  error_message?: string;
  sent_at: string;
}

// Rate limiting: Track email sends per IP
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_EMAILS_PER_WINDOW = 5;

/**
 * Check if request is rate limited
 * @param ip - Client IP address
 * @returns True if rate limit exceeded
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Remove timestamps outside the window
  const validTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (validTimestamps.length >= MAX_EMAILS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);

  return false;
}

/**
 * Retry function with exponential backoff
 * @param fn - Function to retry
 * @param maxAttempts - Maximum retry attempts
 * @returns Result of the function
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 3
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxAttempts) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Retry attempt ${attempt} failed, waiting ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Log email sending attempt to database for audit
 * @param supabaseClient - Supabase client
 * @param log - Email log data
 */
async function logEmailAttempt(
  supabaseClient: ReturnType<typeof createClient>,
  log: EmailLog
): Promise<void> {
  try {
    await supabaseClient.from("email_logs").insert(log);
  } catch (error) {
    console.error("Failed to log email attempt:", error);
    // Don't throw - logging failure shouldn't break email sending
  }
}

/**
 * Get app base URL from environment or default
 */
function getAppBaseUrl(): string {
  return Deno.env.get("APP_BASE_URL") || "https://participa-df.gov.br";
}

/**
 * Generate email HTML template
 * @param protocolo - Protocol number
 * @param senha - Tracking password (optional)
 * @returns HTML string
 */
function generateEmailHTML(protocolo: string, senha?: string): string {
  const baseUrl = getAppBaseUrl();
  const trackingUrl = `${baseUrl}/acompanhamento?protocolo=${protocolo}${senha ? `&senha=${senha}` : ""}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #005CA9; margin: 0;">Ouvidoria Digital</h1>
          <p style="color: #666; margin: 8px 0 0;">Governo do Distrito Federal</p>
        </div>

        <div style="background: #f0f9ff; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="color: #666; margin: 0 0 8px; font-size: 14px;">Seu Protocolo:</p>
          <p style="color: #005CA9; font-size: 28px; font-weight: bold; font-family: monospace; margin: 0;">
            ${protocolo}
          </p>
          ${senha ? `<p style="color: #666; margin: 12px 0 0; font-size: 14px;">Senha: <strong>${senha}</strong></p>` : ""}
        </div>

        <p style="color: #333; line-height: 1.6;">
          Sua manifestação foi registrada com sucesso no sistema de Ouvidoria do Distrito Federal.
        </p>

        <p style="color: #333; line-height: 1.6;">
          Guarde este protocolo${senha ? " e senha" : ""} para acompanhar o andamento da sua manifestação.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${trackingUrl}"
             style="display: inline-block; background: #005CA9; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 500;">
            Acompanhar Manifestação
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">

        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          © 2026 Governo do Distrito Federal - Todos os direitos reservados<br>
          Sistema de Ouvidoria Digital - Participa DF
        </p>
      </div>
    </body>
    </html>
  `;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Initialize Supabase client for logging
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const startTime = Date.now();
  let emailLog: EmailLog | null = null;

  try {
    // Rate limiting check
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (isRateLimited(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({
          error: "Muitas requisições. Tente novamente em alguns instantes.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { email, protocolo, senha }: SendProtocolRequest = await req.json();

    // Validate inputs
    if (!email || !protocolo) {
      console.error("Missing required fields:", {
        email: !!email,
        protocolo: !!protocolo,
      });
      return new Response(
        JSON.stringify({ error: "E-mail e protocolo são obrigatórios" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(
        JSON.stringify({ error: "Formato de e-mail inválido" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check for RESEND_API_KEY - REQUIRED for production
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({
          error: "Serviço de e-mail não configurado. Entre em contato com o suporte.",
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get email sender domain from environment or use default
    const emailFrom =
      Deno.env.get("EMAIL_FROM") || "Ouvidoria DF <noreply@resend.dev>";

    console.log(`Sending protocol email to: ${email} (Protocol: ${protocolo})`);

    // Send email using Resend with retry logic
    const emailResponse = await retryWithBackoff(async () => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [email],
          subject: `Protocolo da Manifestação: ${protocolo}`,
          html: generateEmailHTML(protocolo, senha),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Resend API error: ${JSON.stringify(errorData)}`
        );
      }

      return response;
    });

    const responseData = await emailResponse.json();

    // Log successful send
    emailLog = {
      email,
      protocolo,
      status: "success",
      sent_at: new Date().toISOString(),
    };
    await logEmailAttempt(supabaseClient, emailLog);

    const duration = Date.now() - startTime;
    console.log(`Email sent successfully in ${duration}ms:`, responseData);

    return new Response(
      JSON.stringify({
        success: true,
        message: "E-mail enviado com sucesso!",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-protocol-email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    // Log failed send
    if (emailLog) {
      emailLog.status = "failed";
      emailLog.error_message = errorMessage;
      await logEmailAttempt(supabaseClient, emailLog);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: "Erro ao enviar e-mail. Por favor, anote seu protocolo.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
