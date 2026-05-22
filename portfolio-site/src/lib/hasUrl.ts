/** True when a link field has a non-empty value (ignores whitespace). */
export function hasUrl(url: string | null | undefined): boolean {
  return Boolean(url?.trim())
}
