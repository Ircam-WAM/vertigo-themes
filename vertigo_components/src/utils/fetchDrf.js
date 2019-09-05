import Cookies from 'js-cookie'
import getCsrfToken from './getCsrfToken'

const tok = getCsrfToken()

export default async (url, params) => {
  Cookies.set('csrftoken', tok)

  return fetch(url, {
    // Include cookies for authentication
    credentials: 'same-origin',
    ...params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': tok,
      ...(params && params.headers)
    }
  })
}
