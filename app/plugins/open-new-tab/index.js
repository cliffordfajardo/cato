const browser = require('webextension-polyfill')
const plugin = {
  keyword: "New Tab",
  subtitle: 'Open a new tab in the current window.',
  valid: true,
  autocomplete: false,
  action: openNewTab,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function openNewTab() {
  await browser.tabs.create({})
}

module.exports = plugin
