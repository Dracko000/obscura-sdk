import { ObscureIntent } from '../types'

export function generateIntent(input: ObscureIntent): string {
  const payload = {
    ...input,
    timestamp: Date.now(),
    traceId: crypto.randomUUID?.() || Math.random().toString(36).slice(2, 10)
  }
  return JSON.stringify(payload)
}
