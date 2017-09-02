const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Bookmarks",
  subtitle: 'View your bookmarks page.',
  valid: true,
  autocomplete: false,
  action: openBookmarks,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function openBookmarks() {
  await browser.tabs.create({url: "chrome://bookmarks"})
}

module.exports = plugin
