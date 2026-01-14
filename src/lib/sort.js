export function sortRequests(items, sort) {
  const dir = sort?.dir === 'desc' ? -1 : 1;
  const key = sort?.key || 'created_at';

  const arr = [...(items ?? [])];

  function cmp(a, b) {
    const av = a?.[key];
    const bv = b?.[key];

    // Dates are ISO yyyy-mm-dd; string compare works.
    if (key === 'created_at') {
      return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
    }

    // Numeric ID
    if (key === 'id') {
      return (Number(av) - Number(bv)) * dir;
    }

    return String(av ?? '').localeCompare(String(bv ?? ''), 'ru') * dir;
  }

  arr.sort(cmp);
  return arr;
}

export function toggleSort(prev, key) {
  if (!prev || prev.key !== key) return { key, dir: 'asc' };
  if (prev.dir === 'asc') return { key, dir: 'desc' };
  return { key, dir: 'asc' };
}
