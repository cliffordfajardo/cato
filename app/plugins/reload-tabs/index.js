module.exports = {
  keyword: "Reload All Tabs",
  subtitle: 'Reload the current tab.',
  action: function() {
    chrome.tabs.query({'active': true, currentWindow: true}, function (allTabs) {
      const activeTab = allTabs[0];
      chrome.tabs.reload(activeTab.id);

      chrome.tabs.query({'active': false, currentWindow: true}, function (allTabs) {
        allTabs.forEach((tab) => {
          chrome.tabs.reload(tab.id);
        });
        window.close();
      });

    });
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
