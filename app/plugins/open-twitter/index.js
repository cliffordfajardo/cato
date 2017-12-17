const browser = require('webextension-polyfill')

const plugin = {
  keyword: "Twitter",
  subtitle: 'Open Twitter.',
  action: openTwitter,
  icon: {
    path: 'images/twitter-icon.svg'
  }
}

async function openTwitter() {
  await browser.tabs.create({url: "https://twitter.com"})
}

module.exports = plugin
