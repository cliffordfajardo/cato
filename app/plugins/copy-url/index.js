const browser = require('webextension-polyfill')
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

  document.addEventListener('copy', (event) => {
    event.preventDefault() //this doesn't work w/o this. Investigate why for exploration's sake?
    const text = activeTabUrl
    event.clipboardData.setData('text/plain', text)
  }, {once: true})
  document.execCommand('copy')
  window.close()
}

module.exports = plugin
