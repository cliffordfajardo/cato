const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Settings",
  subtitle: 'Open the browser\'s settings page.',
  action: openSettings,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function openSettings() {
  await browser.tabs.create({url: "chrome://settings"})
}

module.exports = plugin
