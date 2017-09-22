const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Toggle Fullscreen",
  subtitle: 'Turn fullscreen mode on/off for the window.',
  action: toggleFullscreenMode,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function toggleFullscreenMode() {
  const activeWindow = await browser.windows.get(browser.windows.WINDOW_ID_CURRENT)
  const isFullScreen = activeWindow.state === 'fullscreen'

  if (isFullScreen) {
    browser.windows.update(browser.windows.WINDOW_ID_CURRENT, {state: "normal"})
  }
  else {
    browser.windows.update(browser.windows.WINDOW_ID_CURRENT, {state: "fullscreen"})
  }
}

module.exports = plugin
