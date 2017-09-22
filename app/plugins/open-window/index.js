const browser = require('webextension-polyfill')
const plugin = {
  keyword: "New Window",
  subtitle: 'Open a new browser window.',
  action: openNewWindow,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function openNewWindow() {
  browser.windows.create({})
}

module.exports = plugin
