/**
 * @returns Get system's setting is dark mode
 */
export function isMediaDarkMode() {
  return window.matchMedia?.('prefers-color-scheme: dark)').matches || false
}

/**
 * Watch for dark mode changed
 * @param callback Function to call when dark mode changed
 */
export function watchMediaDarkMode(callback: (isDarkMode: boolean) => void) {
  const mediaQueryList = window.matchMedia?.('prefers-color-scheme: dark)')
  const changeEventHandler = (e: MediaQueryListEvent) => {
    callback(e.matches)
  }
  mediaQueryList?.addEventListener('change', changeEventHandler)
  return () => mediaQueryList?.removeEventListener('change', changeEventHandler)
}

/**
 * tailwindcss dark mode class
 */
export const HTML_DARK_CLASS = 'dark'

/**
 * Set dark mode or not
 * @param isDarkMode target mode is dark?
 */
export function setDarkMode(isDarkMode: boolean) {
  const classes = document.documentElement.classList
  if (isDarkMode) {
    if (!classes.contains(HTML_DARK_CLASS)) {
      classes.add(HTML_DARK_CLASS)
    }
  } else {
    if (classes.contains(HTML_DARK_CLASS)) {
      classes.remove(HTML_DARK_CLASS)
    }
  }
}
