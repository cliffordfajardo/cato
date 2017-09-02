const browser = require('webextension-polyfill')
const utils = require('../../util.js')

const plugin = {
  keyword: "Find Bookmark",
  subtitle: 'Search for a bookmark and open it.',
  valid: false,
  autocomplete: true,
  hasSearchScope: true,
  action: findBookmark,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function findBookmark() {
  window.currentSearchSuggestions = []
  if(!plugin.valid && plugin.autocomplete) {
    window.searchInput.value = `${plugin.keyword} `
    window.searchResultsList.innerHTML = ""

    const nodes = await browser.bookmarks.getTree()
    recurseTree(nodes)
    utils.renderSuggestions(window.currentSearchSuggestions)
  }
}

function recurseTree(nodes) {
  for (const node of nodes) {
    if (utils.isBookmark(node)) {
      const suggestion = {
        keyword: node.title,
        subtitle: node.url,
        action: async function () {
          await browser.tabs.create({url: node.url})
        },
        icon: {
          path: `chrome://favicon/${node.url}`
        }
      }
      window.currentSearchSuggestions.push(suggestion)
    }
    else if (utils.isFolder(node)) {
      recurseTree(node.children)
    }
  }
}

module.exports = plugin
