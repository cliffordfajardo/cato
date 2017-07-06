const utils = {};

/****************************BROWSWER ACTIONS*****************************
 * The following browser actions can only called from the background script
 * context. Using these functions in our content scripts, which run in the
 * context of web pages, will break our extension.
 ***********************************************************************/

/**
 * @description Creates a new tab taking the user to his/her bookmarks.
 * @return {void}
 */
utils.openBookmarksTab = function openBookmarksTab() {
  chrome.tabs.create({url: "chrome://bookmarks"});
}

/**
 * @description Creates a new tab taking the user to his/her recent downloads.
 * @return {void}
 */
utils.openDownloadsTab = function openDownloadsTab() {
  chrome.tabs.create({url: "chrome://downloads"});
}

/**
 * @description Creates a new tab taking the user to his/her chrome extensions.
 * @return {void}
 */
utils.openExtensionsTab = function openExtensionsTab() {
  chrome.tabs.create({url: "chrome://extensions"});
}

/**
 * @description Creates a new tab taking the user to his/her bookmarks.
 * @return {void}
 */
utils.openIncognitoWindow = function openIncognitoWindow() {
  chrome.windows.create({'incognito': true});
}

/**
 * @description Creates a new blank browser tab.
 * @return {void}
 */
utils.openNewTab = function openNewTab() {
  chrome.tabs.create({});
}

/**
 * @description Creates a new blank browswer window.
 * @return {void}
 */
utils.openNewWindow = function openNewTab() {
  chrome.windows.create({});
}

/**
 * @description Creates a new tab taking the user to his/her settings.
 * @return {void}
 */
utils.openSettingsTab = function openExtensionsTab() {
  chrome.tabs.create({url: "chrome://settings"});
}



/**
 * @description Close all tabs except the active one in the current active window.
 * @type {void}
 */
utils.closeAllButActiveTabInActiveWindow = function closeAllButActiveTabInActiveWindow(){
  chrome.tabs.query({'active': false, currentWindow: true}, (otherTabs) => {
      let otherTabIds = [];
      for (tab of otherTabs) {
          otherTabIds.push(tab.id);
      }
      chrome.tabs.remove(otherTabIds);
  });
}

/**
 * @description Mutes/unmutes the active tab.
 * @type {void}
 */
utils.toggleMuteActiveTab = function toggleMuteActiveTab(){
  chrome.tabs.query({'active': true, currentWindow: true}, (tabs) => {
    const isMuted = tabs[0].mutedInfo.muted;
    chrome.tabs.update({'muted': !isMuted});
  });
}

/**
 * TODO fix..only muting current tab + hitting it again will not unmute it.
 * @description Mutes/unmutes all tabs
 * @return {void}
 */
utils.toggleMuteAllTabs = function toggleMuteAllTabs(){
  chrome.windows.getAll({populate:true},(browserWindows) => {
    browserWindows.forEach((browserWindow) => {

      browserWindow.tabs.forEach((tab) => {
        const isMuted = tab.mutedInfo.muted;
        chrome.tabs.update({'muted': !isMuted});
      });
    });
  });
}


/**
 * @description Creates a new tab taking the user to his/her browsing history.
 * @return {void}
 */
utils.openHistoryTab = function openHistoryTab() {
  chrome.tabs.create({url: "chrome://history"});
}

/**
 * @description reloads the current tab.
 * @return {void}
 */
utils.reloadActiveTab = function reloadActiveTab() {
  chrome.tabs.reload();
}

/**
 * @description  Copies the URL from the current tab & add's it to the user's clipboard.
 * @type {void}
 */
utils.copyActiveTabUrl = function copyActiveTabUrl() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const activeTabUrl = tabs[0].url;

    document.addEventListener('copy', (event) => {
      const text = activeTabUrl;
      event.clipboardData.setData('text/plain', text);
      event.preventDefault();
    },{once: true});
    //manually call 'copy', but this is usually triggered when user does 'cmd-c'
    document.execCommand('copy');
  });
}

/**
 * @description duplicates the current tab in a new tab.
 * @return {void}
 */
utils.duplicateActiveTab = function duplicateActiveTab() {
  chrome.tabs.query({active: true,currentWindow: true}, (tabs) => {
    const activeTabUrl = tabs[0].url;
    chrome.tabs.create({url: activeTabUrl});
  });
}

/**
 * @description Copies the current tab's URL & creates a new incognito window with the URL of the old tab.
 * @return {void}
 */
utils.cloneTabToIncognitoWindow = function cloneTabToIncognitoWindow() {
  //grab the URL of the current tab
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const activeTabUrl = tabs[0].url;
    chrome.windows.create({incognito: true, url: activeTabUrl});
  });
}

/**
 * @description Toggles full screen mode for the current tab.
 * @type {void}
 */
utils.toggleFullscreenForActiveWindow = function toggleFullscreenForActiveWindow() {
  chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, (activeWindow) => {
    const isFullScreen = activeWindow.state === 'fullscreen' ? true: false;
    if (isFullScreen) {
      chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, {state: "normal"});
    } else {
      chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, {state: "fullscreen"});
    }
  });
}

//TODO: find cleaner method for printing
utils.printActiveTab = function printActiveTab(){
  chrome.tabs.update(null, {url: 'javascript:window.print();'});
}

/**
 * @description Closes the active tab.
 * @return {void}
 */
utils.closeActiveTab = function closeActiveTab() {
  chrome.tabs.query({'active': true, currentWindow: true}, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.remove(activeTab.id);
  });
}

/**
 * @description Creates a new tab to gmail.
 * @return {void}
 */
utils.openGmailTab = function openGmailTab() {
  chrome.tabs.create({url: "https://mail.google.com"});
}

/**
 * @description Creates a new tab to gmail.
 * @return {void}
 */
utils.openGoogleDriveTab = function openGoogleDriveTab() {
  chrome.tabs.create({url: "https://drive.google.com"});
}
/**
 * @description Creates a new tab to google calendar.
 * @return {void}
 */
utils.openGoogleCalendarTab = function openGoogleCalendarTab() {
  chrome.tabs.create({url: "https://calendar.google.com"});
}

/**
 * TODO: fix icon URLs for things like settings, extensions etc
 * @description Given a windowId & tabId, changes a user's current tab to another tab (in same window or out).
 * @return {void}
 */
utils.switchToTabById = function switchToTabById(windowId, tabId) {
  //since chrome.tabs.update is limited to switching to tabs only within the current window
  //we need to switch to the window we need first.
  return function(){
    chrome.windows.update(windowId, {focused:true},() => {
      chrome.tabs.update(tabId, {'active': true});
    })
  }
}


/*TODO:
Add commands liek so.. what if we get a 10 matches and the one we want is at position 5..we don't want to requeyr
'shortcut': {
        'windows': ['^', 'R'],
        'mac': ['⌘', '1...9']
    }
*/
utils.defaultSeachSuggestions = [
  {
    text: "Open Bookmarks",
    action: utils.openBookmarksTab,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Open Downloads",
    action: utils.openDownloadsTab,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Open Extensions",
    action: utils.openExtensionsTab,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Open History",
    action: utils.openHistoryTab,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Open Incognito Window",
    action: utils.openIncognitoWindow,
    icon: 'images/incognito.png'
  },
  {
    text: "Open New Tab",
    action: utils.openNewTab,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Open New Window",
    action: utils.openNewWindow,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Open Settings",
    action: utils.openSettingsTab,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Open Gmail",
    action: utils.openGmailTab,
    icon: 'images/gmail.png'
  },
  {
    text: "Open Google Drive",
    action: utils.openGoogleDriveTab,
    icon: 'images/google-drive.png'
  },
  {
    text: "Open Google Calendar",
    action: utils.openGoogleCalendarTab,
    icon: 'images/google-calendar.png'
  },
  {
    text: "Reload Current Tab",
    action: utils.reloadActiveTab,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Copy Current Tab URL",
    action: utils.copyActiveTabUrl,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Duplicate Tab",
    action: utils.duplicateActiveTab,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Duplicate Tab to Incognito",
    action: utils.cloneTabToIncognitoWindow,
    icon: 'images/incognito.png'
  },
  {
    text: "Toggle Fullscreen",
    action: utils.toggleFullscreenForActiveWindow,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Close Tab",
    action: utils.closeActiveTab,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Mute/Unmute Tab",
    action: utils.toggleMuteActiveTab,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Mute/Unmute All Tans",
    action: utils.toggleMuteAllTabs,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Close Tabs Except Current",
    action: utils.closeAllButActiveTabInActiveWindow,
    icon: 'images/chrome-logo.png'
  },
  {
    text: "Print Page",
    action: utils.printActiveTab,
    icon: 'images/chrome-logo.png'
  }

];
module.exports = utils;
