module.exports = {
  keyword: "Close Tabs Except Current",
  subtitle: 'Closes all tabs in this window except the current.',
  valid: true,
  action: function() {
    chrome.tabs.query({'active': false, currentWindow: true}, (otherTabs) => {
      const otherTabIds = otherTabs.map((tab) => tab.id);
      chrome.tabs.remove(otherTabIds);
    });
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
