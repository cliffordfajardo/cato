const browser = require('webextension-polyfill')
const domain = require('getdomain')
const sortBy = require('lodash.sortby')

const plugin = {
  keyword: "Sort Tabs",
  subtitle: 'Sort tabs by website.',
  valid: true,
  action: sortTabs,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function sortTabs() {
  const allWindows = await browser.windows.getAll({populate: true})
  allWindows.forEach((browserWindow) => {
    let browserWindowTabs = []

    browserWindow.tabs.forEach((tab) => {
      browserWindowTabs.push({id: tab.id, domain: domain.origin(tab.url)})
    })
    browserWindowTabs = sortBy(browserWindowTabs, ['domain'])
    browserWindowTabs.forEach((tab, index) => browser.tabs.move(tab.id, {index}))
  })
  window.close()

}

module.exports = plugin
