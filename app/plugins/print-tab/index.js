const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Print Tab",
  subtitle: 'Display the print menu for the current page.',
  valid: true,
  autocomplete: false,
  action: printTab,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function printTab() {
  await browser.tabs.executeScript(null, {code: `window.print();`})
}

module.exports = plugin
