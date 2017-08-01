module.exports = {
  keyword: "Close Tab",
  subtitle: 'Close the current tab.',
  autocomplete: false,
  valid: true,
  action: function closeActiveTab() {
    chrome.tabs.query({currentWindow: true}, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.remove(activeTab.id);
    });
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
