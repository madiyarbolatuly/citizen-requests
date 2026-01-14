import { describe, expect, it } from 'vitest';
import { filterRequests } from '../requestsFilters';

describe('filterRequests', () => {
  const items = [
    { id: 1, category: 'Вывоз мусора', address: 'ул. Абая, 45', status: 'В работе' },
    { id: 2, category: 'Освещение улиц', address: 'пр. Аль-Фараби, 10', status: 'Решено' },
  ];

  it('filters by status', () => {
    expect(filterRequests(items, { status: 'Решено', query: '' }).map((x) => x.id)).toEqual([2]);
  });

  it('searches by category or address', () => {
    expect(filterRequests(items, { status: '', query: 'абая' }).map((x) => x.id)).toEqual([1]);
    expect(filterRequests(items, { status: '', query: 'освещение' }).map((x) => x.id)).toEqual([2]);
  });
});
