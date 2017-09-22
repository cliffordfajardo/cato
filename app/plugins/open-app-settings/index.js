const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Cato Settings",
  subtitle: 'View the settings page for Cato (this app).',
  action: openApplicationOptions,
  icon: {
    path: 'images/cato-logo.png'
  }
}

async function openApplicationOptions() {
  await browser.runtime.openOptionsPage()
}

module.exports = plugin
