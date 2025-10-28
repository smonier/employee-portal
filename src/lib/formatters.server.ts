export function formatDateLong(dateISO: string | undefined, locale: string): string | null {
  if (!dateISO) return null;
  const d = new Date(dateISO);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString(locale, { dateStyle: "long" });
}
