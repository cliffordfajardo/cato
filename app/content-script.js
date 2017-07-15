console.log('*****************Running content-script******************************', document);



/**
 * Listen for a copy event on every webpage, grab the copied content, send the copied content
 * to the background script.
 */
document.addEventListener('copy', function copy(event) {
  const copiedContent = window.getSelection().toString();
  const message = {
    type: "copy-event",
    copiedContent: copiedContent,
    iconUrl: `chrome://favicon/${window.origin}`
  };
  event.clipboardData.setData('text/plain', copiedContent); //w/o this our actual OS clipboard won't update!
  event.preventDefault();

  chrome.runtime.sendMessage(message, function response(/*response*/) {
    console.log('BG: copy-event worked');
  });

  // event.clipboardData.setData('text/plain', text);
  event.preventDefault();
});



// console.log('!!!!!!!!!!!!!!!!');

// manually call 'copy', but this is usually triggered when user does 'cmd-c'
// document.execCommand('copy');
