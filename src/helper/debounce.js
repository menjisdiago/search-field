export function debouncer(callbackFunction, timeout) {
  let timer = null;

  return (...params) => {
    if (timer)
      window.clearTimeout(timer);

    timer = window.setTimeout(() => {
      callbackFunction(...params)
    }, timeout)
  }
}
