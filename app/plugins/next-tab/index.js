const browser = require('webextension-polyfill')
const utils = require('../../util.js')

const plugin = {
  keyword: "Next Tab",
  subtitle: 'Change to the next tab in your browser window.',
  action: nextTab,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function nextTab() {
  const allTabs = await browser.tabs.query({currentWindow: true})
  let activeTabIndex = allTabs.findIndex((tab) => tab.active)
  let nextTabIndex = activeTabIndex + 1 === allTabs.length ? 0 : activeTabIndex + 1
  const nextTab = allTabs[nextTabIndex]
  await browser.tabs.update(nextTab.id , {active: true})
}

module.exports = plugin
