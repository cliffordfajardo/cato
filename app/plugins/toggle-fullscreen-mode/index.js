module.exports = {
  keyword: "Toggle Fullscreen",
  subtitle: 'Turn fullscreen mode on/off for the window.',
  valid: true,
  autocomplete: false,
  action: function() {
    chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, (activeWindow) => {
      const isFullScreen = activeWindow.state === 'fullscreen';

      if (isFullScreen) {
        chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, {state: "normal"});
      }
      else {
        chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, {state: "fullscreen"});
      }
    });
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
