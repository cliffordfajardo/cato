const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Extension Shortcuts",
  subtitle: 'View or setup shortcuts for your chrome extensions',
  action: openExtensionShortcuts,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function openExtensionShortcuts() {
  await browser.tabs.create({ url: "chrome://extensions/shortcuts" })
}

module.exports = plugin
