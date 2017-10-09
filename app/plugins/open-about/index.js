const browser = require('webextension-polyfill')
const plugin = {
  keyword: "About",
  subtitle: 'View general information about your browser.',
  action: openSettings,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function openSettings() {
  await browser.tabs.create({
    url: "chrome://settings/help"
  });
}

module.exports = plugin;
