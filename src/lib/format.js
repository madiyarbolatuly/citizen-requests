export function formatDateISO(iso) {
  // Keep it simple; data is yyyy-mm-dd.
  if (!iso) return '';
  return String(iso);
}
