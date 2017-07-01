const utils = require('./common/utils');


/**
 * @description
 * A listener that fires when a content-script
 * @param  {Object | any} request      [description]
 * @param  {} sender       [description]
 * @param  {} sendResponse [description]
 * @return {void}
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

  if(request.action === 'openBookmarksTab'){
    utils.openBookmarksTab();
  }

  if(request.action === 'openDownloadsTab'){
    utils.openDownloadsTab();
  }

  if(request.action === 'openExtensionsTab'){
    utils.openExtensionsTab();
  }

  if(request.action === 'openIncognitoWindow'){
    utils.openNewTab();
  }


  if(request.action === 'openNewTab'){
    utils.openNewTab();
  }

  if(request.action === 'openNewWindow'){
    utils.openNewWindow();
  }


  if(request.action === 'openSettingsTab'){
    utils.openSettingsTab();
  }

})


function open(tab) {
  console.log('firing')
	chrome.browserAction.setPopup({
		"popup" : "index.html"
	});
}

chrome.browserAction.onClicked.addListener(open);
