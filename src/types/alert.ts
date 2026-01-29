export type AlertItem = {
  severity: "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  message: string
  status: "ACTIVE" | "RESOLVED"
  created_at: string
}