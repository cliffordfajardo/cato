module.exports = {
  keyword: "Mute/Unmute Tab",
  subtitle: 'Mute the tab if it\'s unmuted otherwise unmute it.',
  valid: true,
  action: function () {
    chrome.tabs.query({'active': true, currentWindow: true}, (tabs) => {
      const isMuted = tabs[0].mutedInfo.muted;
      chrome.tabs.update({'muted': !isMuted});
    });
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
