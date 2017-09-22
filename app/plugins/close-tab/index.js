const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Close Tab",
  subtitle: 'Close the current tab.',
  action: closeTab,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function closeTab() {
  const activeTab = await browser.tabs.query({active: true, currentWindow: true})
  await browser.tabs.remove(activeTab[0].id)
  const popupWindow = await browser.extension.getViews({type: 'popup'})[0]
  popupWindow.close()
}

module.exports = plugin
