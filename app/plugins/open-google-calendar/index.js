const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Google Calendar",
  subtitle: 'Open Google Calendar',
  valid: true,
  autocomplete: false,
  action: openGoogleCalendar,
  icon: {
    path: 'images/google-calendar-icon.png'
  }
}

async function openGoogleCalendar() {
  await browser.tabs.create({url: "https://calendar.google.com"});
}

module.exports = plugin
