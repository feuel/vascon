export function getItemFromArray<T>(
  array: T[],
  matcher: (value: T, index: number, obj: T[]) => boolean,
  fromIndex = 0
) {
  for (let index = fromIndex; index < array.length; index++) {
    const item = array[index];
    if (matcher(item, index, array)) {
      return { index, item };
    }
  }
  return null;
}

export function immutableAddToSet<T>(
  array: T[],
  item: T,
  uniqueBy: (value: T, index: number, obj: T[]) => boolean = (x) => x === item
) {
  const copy = array.slice(0);
  const found = getItemFromArray(array, uniqueBy);
  if (found) copy.splice(found.index, 1, item);
  else copy.push(item);
  return copy;
}

export function immutableToggleItemInArray<T>(
  array: T[],
  item: T,
  uniqueBy: (value: T, index: number, obj: T[]) => boolean = (x) => x === item
) {
  const copy = array.slice(0);
  const found = getItemFromArray(array, uniqueBy);
  if (found) copy.splice(found.index, 1);
  else copy.push(item);
  return copy;
}

export function immutableUnshiftToArray<T>(array: T[], item: T) {
  const copy = array.slice(0);
  copy.unshift(item);
  return copy;
}

export function immutableRemoveItemFromArray<T>(
  array: T[],
  matcher: number | ((value: T, index: number, obj: T[]) => boolean)
) {
  const copy = array.slice(0);
  let index;
  if (typeof matcher === 'function') {
    index = copy.findIndex(matcher);
  } else {
    index = matcher;
  }
  if (index === -1) return copy;
  copy.splice(index, 1);
  return copy;
}

export function immutableReplaceItemAtIndex<T>(
  array: T[],
  item: T,
  index: number
) {
  const copy = array.slice(0);
  if (index === -1) return copy;
  copy.splice(index, 1, item);
  return copy;
}

export function immutableUpdateItemInSet<T>(
  array: T[],
  updater: (item: T) => T,
  finder: (value: T, index: number, obj: T[]) => boolean
) {
  const copy = array.slice(0);
  const found = getItemFromArray(array, finder);
  if (!found) throw new Error();
  copy.splice(found.index, 1, updater({ ...found.item }));
  return copy;
}
