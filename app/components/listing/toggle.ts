/** Adds the value if missing, removes it if present. */
export function toggle<T>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}
