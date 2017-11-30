const browser = require('webextension-polyfill')
const plugin = {
  keyword: "View Source",
  subtitle: 'Shows the source code of the current page',
  action: viewSource,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function viewSource() {
  const tabs = await browser.tabs.query({active: true, currentWindow: true});
  const activeTabUrl = tabs[0].url;
  const viewSourceString = 'view-source:';

  if (!activeTabUrl.startsWith(viewSourceString)) {
      await browser.tabs.create({url: viewSourceString+activeTabUrl});
  } else {
      // If this page is a source page, then just clone it.
      await browser.tabs.create({url: activeTabUrl}); 
  }

}

module.exports = plugin
