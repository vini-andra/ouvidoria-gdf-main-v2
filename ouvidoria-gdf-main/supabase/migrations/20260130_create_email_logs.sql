-- Create email_logs table for audit trail
-- This table stores all email sending attempts for monitoring and compliance

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  protocolo TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indices for common queries
CREATE INDEX IF NOT EXISTS idx_email_logs_protocolo ON email_logs(protocolo);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE email_logs IS 'Audit log of all email sending attempts';
COMMENT ON COLUMN email_logs.email IS 'Recipient email address';
COMMENT ON COLUMN email_logs.protocolo IS 'Manifestation protocol number';
COMMENT ON COLUMN email_logs.status IS 'Email send status: success or failed';
COMMENT ON COLUMN email_logs.error_message IS 'Error message if status is failed';
COMMENT ON COLUMN email_logs.sent_at IS 'When the email was sent (or attempt was made)';
COMMENT ON COLUMN email_logs.created_at IS 'Record creation timestamp';

-- Grant permissions (adjust based on your RLS policies)
-- Allow service role (Edge Function) to insert
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can insert logs
CREATE POLICY "Service role can insert email logs"
  ON email_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Authenticated users can view their own logs (optional)
CREATE POLICY "Users can view email logs for their protocols"
  ON email_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM manifestacoes m
      WHERE m.protocolo = email_logs.protocolo
      AND (m.user_id = auth.uid() OR m.email = email_logs.email)
    )
  );

-- Create view for email statistics
CREATE OR REPLACE VIEW email_stats_daily AS
SELECT
  DATE(sent_at) as date,
  COUNT(*) as total_emails,
  COUNT(*) FILTER (WHERE status = 'success') as successful,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'success')::numeric / NULLIF(COUNT(*), 0) * 100,
    2
  ) as success_rate_pct
FROM email_logs
GROUP BY DATE(sent_at)
ORDER BY DATE(sent_at) DESC;

COMMENT ON VIEW email_stats_daily IS 'Daily email sending statistics for monitoring';
