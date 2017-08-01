module.exports = {
  keyword: "Duplicate Tab Incognito",
  subtitle: 'Duplicate the tab and place it in an incognito window.',
  autcomplete: false,
  valid: true,
  action: function() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const activeTabUrl = tabs[0].url;
      chrome.windows.create({incognito: true, url: activeTabUrl});
    });
  },
  icon: {
    path: 'images/incognito-icon.png'
  }
}
