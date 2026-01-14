export const STATUS_OPTIONS = ['В работе', 'Решено', 'Отклонено'];

export function normalizeString(v) {
  return String(v ?? '')
    .trim()
    .toLowerCase();
}

export function filterRequests(items, { status, query }) {
  const q = normalizeString(query);

  return (items ?? []).filter((r) => {
    if (status && r.status !== status) return false;

    if (!q) return true;
    const hay = `${r.category ?? ''} ${r.address ?? ''}`.toLowerCase();
    return hay.includes(q);
  });
}
