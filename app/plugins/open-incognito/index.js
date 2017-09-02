const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Incognito Window",
  subtitle: 'Open a new incognito browser window.',
  valid: true,
  autocomplete: false,
  action: openIncognitoWindow,
  icon: {
    path: 'images/incognito-icon.png'
  }
}

async function openIncognitoWindow() {
  await browser.windows.create({'incognito': true})
}

module.exports = plugin
