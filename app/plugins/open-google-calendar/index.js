module.exports = {
  keyword: "Google Calendar",
  subtitle: 'Open Google Calendar',
  valid: true,
  autcomplete: false,
  action: function() {
    chrome.tabs.create({url: "https://calendar.google.com"});
  },
  icon: {
    path: 'images/google-calendar-icon.png'
  }
}
