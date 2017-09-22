const browser = require('webextension-polyfill')
const utils = require('../../util.js')

const plugin = {
  keyword: "Previous Tab",
  subtitle: 'Change to the previous tab in your browser window.',
  action: nextTab,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function nextTab() {
  const allTabs = await browser.tabs.query({currentWindow: true})
  let activeTabIndex = allTabs.findIndex((tab) => tab.active)
  let previousTabIndex = (activeTabIndex - 1 < 0) ? allTabs.length - 1 : activeTabIndex - 1
  const nextTab = allTabs[previousTabIndex]
  await browser.tabs.update(nextTab.id , {active: true})
}

module.exports = plugin
