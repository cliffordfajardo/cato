const browser = require('webextension-polyfill')
const plugin = {
  keyword: 'Bookmark/Unbookmark page',
  subtitle: 'Bookmark the page if it\'s not bookmarked, otherwise unbookmark it.',
  autocomplete: false,
  valid: true,
  action: toggleBookmark,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function toggleBookmark() {
  const allTabs = await browser.tabs.query({'active': true, currentWindow: true})
  const activeTab = allTabs[0]
  const matchedBookmarks = await browser.bookmarks.search({url: activeTab.url})

  if (matchedBookmarks.length === 0) {
    await browser.bookmarks.create({title: activeTab.title, url: activeTab.url})
  }
  else {
    // apparently, you can bookmark the same page in a different tab.
    for (const bookmark of matchedBookmarks) {
      await browser.bookmarks.remove(bookmark.id)
    }
  }
  window.close()
}

module.exports = plugin
