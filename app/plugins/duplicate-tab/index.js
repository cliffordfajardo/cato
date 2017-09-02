const browser = require('webextension-polyfill')

const plugin = {
  keyword: "Duplicate Tab",
  subtitle: 'Duplicate the tab and place it in a new tab.',
  valid: true,
  action: duplicateTab,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function duplicateTab() {
  const allTabs = await browser.tabs.query({active: true, currentWindow: true})
  const activeTabUrl = allTabs[0].url
  await browser.tabs.create({url: activeTabUrl})
}

module.exports = plugin
