import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SendProtocolRequest {
  email: string;
  protocolo: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, protocolo }: SendProtocolRequest = await req.json();

    // Validate inputs
    if (!email || !protocolo) {
      console.error("Missing required fields:", { email: !!email, protocolo: !!protocolo });
      return new Response(JSON.stringify({ error: "E-mail e protocolo são obrigatórios" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(JSON.stringify({ error: "Formato de e-mail inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for RESEND_API_KEY - if not configured, simulate success (MVP/prototype mode)
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      // MVP/Prototype mode: simulate email sending
      console.log(`[PROTOTYPE MODE] Simulating email to: ${email} with protocol: ${protocolo}`);

      // Simulate a small delay like a real email service
      await new Promise((resolve) => setTimeout(resolve, 500));

      return new Response(
        JSON.stringify({
          success: true,
          message: "E-mail enviado com sucesso!",
          prototype: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send email using Resend
    console.log("Sending protocol email to:", email);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ouvidoria DF <noreply@resend.dev>",
        to: [email],
        subject: `Protocolo da Manifestação: ${protocolo}`,
        html: `
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
              </div>
              
              <p style="color: #333; line-height: 1.6;">
                Sua manifestação foi registrada com sucesso no sistema de Ouvidoria do Distrito Federal.
              </p>
              
              <p style="color: #333; line-height: 1.6;">
                Guarde este protocolo para acompanhar o andamento da sua manifestação.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                © 2026 Governo do Distrito Federal - Todos os direitos reservados<br>
                Sistema de Ouvidoria Digital - Participa DF
              </p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const responseData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", responseData);
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

    console.log("Email sent successfully:", responseData);

    return new Response(JSON.stringify({ success: true, message: "E-mail enviado com sucesso!" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in send-protocol-email:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
