export function createRecordFromSet<T extends object>(
  array: T[],
  id: keyof T,
  transform = (item: T) => ({ ...item })
) {
  return array.reduce((acc, item) => {
    const key = String(item[id]);
    acc[key] = transform(item);
    return acc;
  }, {} as Record<string, T>);
}
