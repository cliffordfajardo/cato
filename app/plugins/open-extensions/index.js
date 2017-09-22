const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Extensions",
  subtitle: 'View your installed browser extensions.',
  action: openExtensions,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function openExtensions() {
  await browser.tabs.create({url: "chrome://extensions"})
}

module.exports = plugin
