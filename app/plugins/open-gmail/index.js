module.exports = {
  keyword: "Gmail",
  subtitle: 'Open Gmail',
  valid: true,
  autcomplete: false,
  action: function() {
    chrome.tabs.create({url: "https://mail.google.com"});
  },
  icon: {
    path: 'images/gmail-icon.png'
  }
}
