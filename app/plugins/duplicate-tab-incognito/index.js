const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Duplicate Tab Incognito",
  subtitle: 'Duplicate the tab and place it in an incognito window.',
  action: duplicateTabIncognito,
  icon: {
    path: 'images/incognito-icon.svg'
  }
}

async function duplicateTabIncognito() {
  const allTabs = await browser.tabs.query({active: true, currentWindow: true})
  const activeTab = allTabs[0]
  const activeTabUrl = allTabs[0].url
  await browser.windows.create({incognito: true, url: activeTabUrl})
}

module.exports = plugin
