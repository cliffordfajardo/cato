const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Downloads",
  subtitle: 'View your browser downloads.',
  action: openDownloads,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function openDownloads() {
  browser.tabs.create({url: "chrome://downloads"})
}

module.exports = plugin
