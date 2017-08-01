module.exports = {
  keyword: "Amazon",
  subtitle: 'Open Amazon.',
  valid: true,
  autcomplete: false,
  action: function() {
    chrome.tabs.create({url: "https://amazon.com"});
  },
  icon: {
    path: 'images/amazon-icon.png'
  }
}
