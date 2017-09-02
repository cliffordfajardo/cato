const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Downloads",
  subtitle: 'View your browser downloads.',
  valid: true,
  autocomplete: false,
  action: openDownloads,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function openDownloads() {
  browser.tabs.create({url: "chrome://downloads"})
}

module.exports = plugin
