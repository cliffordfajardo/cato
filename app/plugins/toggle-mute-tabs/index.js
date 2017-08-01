module.exports = {
  keyword: "Mute/Unmute All Tab",
  subtitle: 'Mute or unmute all tabs.',
  valid: true,
  action: function toggleMuteAllTabs() {
    chrome.windows.getAll({populate: true}, (browserWindows) => {
      browserWindows.forEach((browserWindow) => {

        browserWindow.tabs.forEach((tab) => {
          chrome.tabs.update(tab.id, {'muted': !tab.mutedInfo.muted})
        });

      });
    });
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
