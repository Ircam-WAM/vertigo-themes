export default () => {
  const el = document.querySelector('input[name="csrfmiddlewaretoken"]')
  if (!el) {
    return null
  }
  return el.value
}
