module.exports = {
  keyword: "App Options/Settings",
  subtitle: 'View the settings page for Winfred (this app).',
  valid: true,
  autcomplete: false,
  action: function() {
    chrome.runtime.openOptionsPage();
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
