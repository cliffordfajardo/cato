const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Google Calendar",
  subtitle: 'Open Google Calendar',
  action: openGoogleCalendar,
  icon: {
    path: 'images/google-calendar-icon.svg'
  }
}

async function openGoogleCalendar() {
  await browser.tabs.create({url: "https://calendar.google.com"});
}

module.exports = plugin
