/**
 * A relatively efficient algorithm to deduplicate items in a list which share
 * an id.
 */
export function deduplicateById<T extends { id: string | number }>(items: T[]) {
  // keep track of any duplicates with a map -
  // each time we see an id, we increment the entry
  const duplicatesById: Record<string | number, number> = {};
  items.forEach((item) => {
    duplicatesById[item.id] = (duplicatesById[item.id] ?? 0) + 1;
  });

  // then, we go through the list again, but in reverse. this time, each time
  // we see an ID we decrement the entry. If it's 0, we add
  // the item to the beginning of a new list.
  return items.reverse().reduce<T[]>((newList, item) => {
    duplicatesById[item.id] = duplicatesById[item.id] - 1;
    if (duplicatesById[item.id] > 0) {
      return newList;
    }
    newList.unshift(item);
    return newList;
  }, []);
}
