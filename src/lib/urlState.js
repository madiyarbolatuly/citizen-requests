export function readQueryState() {
  const sp = new URLSearchParams(window.location.search);
  return {
    status: sp.get('status') ?? '',
    q: sp.get('q') ?? '',
    page: Number(sp.get('page') ?? '1') || 1,
    sortKey: sp.get('sortKey') ?? 'created_at',
    sortDir: sp.get('sortDir') === 'asc' ? 'asc' : 'desc',
  };
}

export function writeQueryState(next) {
  const sp = new URLSearchParams(window.location.search);

  function setOrDelete(key, value) {
    if (value == null || value === '' || value === false) sp.delete(key);
    else sp.set(key, String(value));
  }

  setOrDelete('status', next.status);
  setOrDelete('q', next.q);
  setOrDelete('page', next.page && next.page !== 1 ? next.page : '');
  setOrDelete('sortKey', next.sortKey && next.sortKey !== 'created_at' ? next.sortKey : '');
  setOrDelete('sortDir', next.sortDir && next.sortDir !== 'desc' ? next.sortDir : '');

  const qs = sp.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash ?? ''}`;
  window.history.replaceState({}, '', url);
}
