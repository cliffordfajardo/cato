module.exports = {
  keyword: "Incognito Window",
  subtitle: 'Open a new incognito browser window.',
  valid: true,
  autcomplete: false,
  action: function() {
    chrome.windows.create({'incognito': true});
  },
  icon: {
    path: 'images/incognito-icon.png'
  }
}
