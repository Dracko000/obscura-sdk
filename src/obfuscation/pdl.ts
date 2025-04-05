export function wrapWithPDL(intentPayload: string): string {
  const noise = Math.random().toString(36).substring(2, 8)
  return `${noise}::${intentPayload}::${noise}`
}
