const browser = require('webextension-polyfill')
const plugin = {
  keyword: "New Window",
  subtitle: 'Open a new browser window.',
  autocomplete: false,
  valid: true,
  action: openNewWindow,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function openNewWindow() {
  browser.windows.create({})
}

module.exports = plugin
