const browser = require('webextension-polyfill')
const plugin = {
  keyword: "New Tab",
  subtitle: 'Open a new tab in the current window.',
  action: openNewTab,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function openNewTab() {
  await browser.tabs.create({})
}

module.exports = plugin
