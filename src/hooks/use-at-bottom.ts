import * as React from "react"

/**
 * Custom hook that detects whether the user has scrolled to the bottom of the page.
 * @param offset The offset from the bottom of the page at which the user is considered to be at the bottom. Default is 0.
 * @returns A boolean value indicating whether the user is at the bottom of the page.
 */
export function useAtBottom(offset = 0) {
  const [isAtBottom, setIsAtBottom] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsAtBottom(
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - offset
      )
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [offset])

  return isAtBottom
}
