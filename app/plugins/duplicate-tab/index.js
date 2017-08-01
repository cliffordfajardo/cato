module.exports = {
  keyword: "Duplicate Tab",
  subtitle: 'Duplicate the tab and place it in a new tab.',
  valid: true,
  action: function () {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const activeTabUrl = tabs[0].url;
      chrome.tabs.create({url: activeTabUrl});
    });
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
