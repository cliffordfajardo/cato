module.exports = {
  keyword: "Downloads",
  subtitle: 'View your browser downloads.',
  valid: true,
  autcomplete: false,
  action: function() {
    chrome.tabs.create({url: "chrome://downloads"});
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
