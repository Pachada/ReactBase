import type React from 'react'

/** Standard display format across the app */
export const DATE_FORMAT = 'DD/MM/YYYY'

/** Auto-inserts '/' after DD and MM while typing (DD/MM/YYYY) */
export function handleDateKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  if (!/^\d$/.test(e.key)) return
  const input = e.target as HTMLInputElement
  const { value } = input
  const pos = input.selectionStart ?? value.length
  if ((value.length === 2 && pos === 2) || (value.length === 5 && pos === 5)) {
    e.preventDefault()
    const next = value + '/' + e.key
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(
      input,
      next,
    )
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

/** Parse a YYYY-MM-DD string as a local Date (avoids UTC midnight shift) */
export function parseBirthday(raw: string | null | undefined): Date | null {
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null
  const [yStr, mStr, dStr] = raw.split('-')
  const y = Number(yStr)
  const m = Number(mStr)
  const d = Number(dStr)
  if (y <= 0 || m < 1 || m > 12 || d < 1 || d > 31) return null
  const date = new Date(y, m - 1, d)
  if (date.getFullYear() !== y || date.getMonth() + 1 !== m || date.getDate() !== d)
    return null
  return date
}

/** Serialize a Date to YYYY-MM-DD using local time (for backend) */
export function formatYMD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Format a YYYY-MM-DD ISO string for display as DD/MM/YYYY */
export function formatBirthdayDisplay(iso: string | null | undefined): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
