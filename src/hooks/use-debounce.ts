import * as React from "react"

/**
 * Debounces a value by delaying its update until a specified delay has passed.
 *
 * @template T - The type of the value being debounced.
 * @param {T} value - The value to be debounced.
 * @param {number} [delay=500] - The delay in milliseconds before updating the debounced value.
 * @returns {T} - The debounced value.
 */
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay ?? 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
