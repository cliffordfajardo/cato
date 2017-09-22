const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Gmail",
  subtitle: 'Open Gmail',
  action: openGmail,
  icon: {
    path: 'images/gmail-icon.svg'
  }
}

async function openGmail() {
  await browser.tabs.create({url: "https://mail.google.com"})
}

module.exports = plugin
