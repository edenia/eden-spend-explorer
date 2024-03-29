export const appVersion = process.env.REACT_APP_TAG || 'v1.0'
export const name = process.env.REACT_APP_NAME
export const title = process.env.REACT_APP_TITLE
export const logo = process.env.REACT_APP_LOGO
export const eosRate = process.env.REACT_APP_RATE_HISTORY
export const edenContract = process.env.REACT_APP_EDEN_CONTRACT
export const urlEndpoint = process.env.REACT_APP_URL_ENDPOINT
export const footerLinks = JSON.parse(
  process.env.REACT_APP_FOOTER_LINKS || '[]'
)
