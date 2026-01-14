import { describe, expect, it } from 'vitest';
import { paginate } from '../pagination';

describe('paginate', () => {
  it('paginates items and clamps page', () => {
    const items = Array.from({ length: 25 }, (_, i) => i + 1);
    const r1 = paginate(items, 1, 10);
    expect(r1.pageItems).toEqual([1,2,3,4,5,6,7,8,9,10]);

    const r3 = paginate(items, 3, 10);
    expect(r3.pageItems).toEqual([21,22,23,24,25]);

    const r4 = paginate(items, 999, 10);
    expect(r4.page).toBe(3);
  });
});
