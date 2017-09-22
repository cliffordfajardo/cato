const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Bookmarks",
  subtitle: 'View your bookmarks page.',
  action: openBookmarks,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function openBookmarks() {
  await browser.tabs.create({url: "chrome://bookmarks"})
}

module.exports = plugin
