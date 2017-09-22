const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Incognito Window",
  subtitle: 'Open a new incognito browser window.',
  action: openIncognitoWindow,
  icon: {
    path: 'images/incognito-icon.svg'
  }
}

async function openIncognitoWindow() {
  await browser.windows.create({'incognito': true})
}

module.exports = plugin
