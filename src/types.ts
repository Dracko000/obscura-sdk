export interface ObscureIntent {
  to: string
  data: string
  fake?: boolean
  metadata?: Record<string, any>
}
