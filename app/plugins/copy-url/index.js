const browser = require('webextension-polyfill')
const { copyToClipboard } = require('../../util');
const plugin = {
  keyword: "Copy URL",
  subtitle: 'Copy the URL of the current page.',
  action: copyUrl,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function copyUrl() {
  const tabs = await browser.tabs.query({active: true, currentWindow: true})
  const activeTabUrl = tabs[0].url

  copyToClipboard(activeTabUrl, ev => {
    window.close();
  });
}

module.exports = plugin
