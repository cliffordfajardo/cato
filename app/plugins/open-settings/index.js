const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Settings",
  subtitle: 'Open the browser\'s settings page.',
  autocomplete: false,
  valid: true,
  action: openSettings,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function openSettings() {
  await browser.tabs.create({url: "chrome://settings"})
}

module.exports = plugin
