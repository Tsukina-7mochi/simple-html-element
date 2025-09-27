export type SetOrPredicator<T> = T[] | ((value: T) => boolean);

export function setOrPredicatorIncludes<T>(
  setOrPredicator: SetOrPredicator<T>,
  value: T,
) {
  if (typeof setOrPredicator === "function") {
    return setOrPredicator(value);
  }
  return setOrPredicator.includes(value);
}
