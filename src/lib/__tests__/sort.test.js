import { describe, expect, it } from 'vitest';
import { sortRequests, toggleSort } from '../sort';

describe('sortRequests', () => {
  const items = [
    { id: 2, category: 'B', address: 'x', status: 'Решено', created_at: '2025-11-02' },
    { id: 1, category: 'A', address: 'y', status: 'В работе', created_at: '2025-11-01' },
  ];

  it('sorts by id asc', () => {
    const r = sortRequests(items, { key: 'id', dir: 'asc' });
    expect(r.map((x) => x.id)).toEqual([1, 2]);
  });

  it('sorts by created_at desc', () => {
    const r = sortRequests(items, { key: 'created_at', dir: 'desc' });
    expect(r.map((x) => x.id)).toEqual([2, 1]);
  });
});

describe('toggleSort', () => {
  it('cycles asc/desc when clicking same key', () => {
    expect(toggleSort(null, 'id')).toEqual({ key: 'id', dir: 'asc' });
    expect(toggleSort({ key: 'id', dir: 'asc' }, 'id')).toEqual({ key: 'id', dir: 'desc' });
    expect(toggleSort({ key: 'id', dir: 'desc' }, 'id')).toEqual({ key: 'id', dir: 'asc' });
  });

  it('switches key and resets to asc', () => {
    expect(toggleSort({ key: 'id', dir: 'desc' }, 'category')).toEqual({ key: 'category', dir: 'asc' });
  });
});
