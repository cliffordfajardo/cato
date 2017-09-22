const browser = require('webextension-polyfill')
const utils = require('../../util.js')

const plugin = {
  keyword: "Find Bookmark",
  subtitle: 'Search for a bookmark and open it.',
  valid: false,
  searchScope: 'Find Bookmark',
  action: findBookmark,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function findBookmark() {
  window.currentSearchSuggestions = []
  if(!plugin.valid) {
    window.searchInput.value = `${plugin.searchScope} `
    window.searchResultsList.innerHTML = ""

    const nodes = await browser.bookmarks.getTree()
    recurseTree(nodes)
    utils.renderSuggestions(window.currentSearchSuggestions)
    window.suggestionElements = document.querySelectorAll('.cLauncher__suggestion')
  }
}

function recurseTree(nodes) {
  for (const node of nodes) {
    if (isBookmark(node)) {
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
    else if (isFolder(node)) {
      recurseTree(node.children)
    }
  }
}

const isFolder  = (node) => 'children' in node
const isBookmark = (node) => 'url' in node
module.exports = plugin
