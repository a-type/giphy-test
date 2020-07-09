import { deduplicateById } from './deduplicateById';

describe('deduplicate by id', () => {
  test('deduplicates single duplicates', () => {
    expect(
      deduplicateById([{ id: 0 }, { id: 1 }, { id: 0 }, { id: 2 }, { id: 4 }]),
    ).toEqual([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 4 }]);
  });
  test('deduplicates multiple duplicates', () => {
    expect(
      deduplicateById([
        { id: 0 },
        { id: 1 },
        { id: 0 },
        { id: 2 },
        { id: 0 },
        { id: 0 },
        { id: 4 },
      ]),
    ).toEqual([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 4 }]);
  });
  test('deduplicates multiple duplicates of different items', () => {
    expect(
      deduplicateById([
        { id: 0 },
        { id: 1 },
        { id: 0 },
        { id: 2 },
        { id: 0 },
        { id: 0 },
        { id: 4 },
        { id: 2 },
        { id: 4 },
      ]),
    ).toEqual([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 4 }]);
  });
});
