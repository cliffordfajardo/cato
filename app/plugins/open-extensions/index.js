const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Extensions",
  subtitle: 'View your installed browser extensions.',
  valid: true,
  autocomplete: false,
  action: openExtensions,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function openExtensions() {
  await browser.tabs.create({url: "chrome://extensions"})
}

module.exports = plugin
