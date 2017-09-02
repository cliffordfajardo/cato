const browser = require('webextension-polyfill')
const plugin = {
  keyword: "History",
  subtitle: 'Open your search history.',
  valid: true,
  autocomplete: false,
  action: openHistory,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function openHistory() {
  browser.tabs.create({url: "chrome://history"})
}

module.exports = plugin
