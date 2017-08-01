module.exports = {
  keyword: "Google Drive",
  subtitle: 'Open Google Drive.',
  valid: true,
  autcomplete: false,
  action: function() {
    chrome.tabs.create({url: "https://drive.google.com"});
  },
  icon: {
    path: 'images/google-drive-icon.png'
  }
}
