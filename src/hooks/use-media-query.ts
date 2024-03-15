import * as React from "react"

/**
 * A custom hook that returns a boolean value indicating whether the specified media query matches the current viewport.
 *
 * @param query - The media query string to match against the viewport.
 * @returns A boolean value indicating whether the media query matches the current viewport.
 */
export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}
