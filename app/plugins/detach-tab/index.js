const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Detach Tab",
  subtitle: 'Detach the current tab & place it in new window.',
  action: detachTab,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function detachTab() {
  const tabs = await browser.tabs.query({active: true, currentWindow: true})
  const currentTab = tabs[0]
  const newWindow = await browser.windows.create({tabId: currentTab.id})
  await browser.tabs.move({windowId: newWindow.id, index: -1})
}

module.exports = plugin
