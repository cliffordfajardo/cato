const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Toggle View Source",
  subtitle: 'Toggle between the source and the normal view of the current page',
  action: toggleViewSource,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function toggleViewSource() {
  const tabs = await browser.tabs.query({active: true, currentWindow: true});
  const activeTabId = 0 + tabs[0].id;
  const activeTabUrl = tabs[0].url;
  const viewSourceString = 'view-source:';

  if (!activeTabUrl.startsWith(viewSourceString)) {
    await browser.tabs.update(activeTabId, {
        url: viewSourceString+activeTabUrl
    });
  } else {
    await browser.tabs.update(activeTabId, {
        url: activeTabUrl.substring(viewSourceString.length)
    });    
  }
  window.close();
}

module.exports = plugin
