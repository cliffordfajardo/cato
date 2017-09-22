const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Move Tab Left",
  subtitle: 'Swap places with the tab on the right.',
  action: moveTabLeft,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function moveTabLeft() {
  const allTabs = await browser.tabs.query({active: true, currentWindow: true})
  const currentTab = allTabs[0]

  if (currentTab.index !== 0) {
    browser.tabs.move(currentTab.id, {index: currentTab.index - 1})
    window.close()
  }
}

module.exports = plugin
