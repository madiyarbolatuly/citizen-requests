import { useEffect, useState } from 'react';

export function useAsync(asyncFn, deps) {
  const [state, setState] = useState({
    status: 'idle',
    data: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setState({ status: 'loading', data: null, error: null });
      try {
        const data = await asyncFn();
        if (cancelled) return;
        setState({ status: 'success', data, error: null });
      } catch (error) {
        if (cancelled) return;
        setState({ status: 'error', data: null, error });
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
