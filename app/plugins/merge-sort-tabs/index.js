const browser = require('webextension-polyfill')
const sortBy = require('lodash.sortby')
const domain = require('getdomain')

const plugin = {
  keyword: "Sort Tabs and Merge Windows",
  subtitle: 'Move all tabs to the current window and sort them.',
  valid: true,
  autocomplete: false,
  action: sortAndMergeWindows,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function sortAndMergeWindows() {
  const currentWindow = await browser.windows.getCurrent()
  const allWindows = await browser.windows.getAll({populate: true})
  let allTabs = []
  let index = 0

  allWindows.forEach((browserWindow) => {
    browserWindow.tabs.forEach((tab) => {
      allTabs.push({id: tab.id, domain: domain.origin(tab.url)})
    })

    allTabs = sortBy(allTabs, ['domain'])
    allTabs.forEach((tab) => {
      browser.tabs.move(tab.id, {windowId: currentWindow.id, index})
      index += 1
    })
    window.close()

  })
}

module.exports = plugin
