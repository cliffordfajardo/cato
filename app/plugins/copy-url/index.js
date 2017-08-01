module.exports = {
  keyword: "Copy URL",
  subtitle: 'Copy the URL of the page.',
  autcomplete: false,
  valid: true,
  action: function() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const activeTabUrl = tabs[0].url;

      document.addEventListener('copy', (event) => {
        const text = activeTabUrl;

        event.clipboardData.setData('text/plain', text);
        event.preventDefault();
      }, {once: true});
      // manually call 'copy', but this is usually triggered when user does 'cmd-c'
      document.execCommand('copy');
    });
    window.close();
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
