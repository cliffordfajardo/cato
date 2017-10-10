const browser = require('webextension-polyfill');
const {copyToClipboard, renderSuggestions} = require('../../util');

const plugin = {
  keyword: "Shorten URL",
  subtitle: 'Shorten the current url.',
  action: shortenUrl,
  icon: {
    path: 'images/shortened-url-icon.svg'
  }
};

async function shortenUrl() {
  const tabs = await browser.tabs.query({active: true,currentWindow: true});

  const activeTabUrl = tabs[0].url;
  const postUrl = 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyAMSEYpKsnx7pK1I-oKYX7UMC2wumDDjk8'; // Free key allows for 1,000,000 requests per day
  
  const request = new Request(postUrl, {
    method: 'POST',
    body: JSON.stringify({longUrl: activeTabUrl}),
    mode: 'cors',
    headers: new Headers({'Content-Type': 'application/json'})
  });

  //clear suggestions display a temporary suggestion while we wait for a response
  const temporarySuggestion = {
    keyword: "Attempting to shorten url.",
    subtitle: '...',
    icon: plugin.icon
  }
  window.searchResultsList.innerHTML = ''
  window.currentSearchSuggestions = [temporarySuggestion]
  renderSuggestions(window.currentSearchSuggestions)
  
  let data = null;
  let suggestion = null;
  try {
    data =  await (await fetch(request)).json();
    if (!data.id) throw new Error('Property ID not found on response object');
    suggestion = {
      keyword: `${data.id}`,
      subtitle: 'Copy shortened url to your clipboard.',
      action: () => {
        copyToClipboard(data.id, ev => {
            window.close();
        });
      },
      icon: plugin.icon
    };
  } catch (e) {
    data = {
      id: activeTabUrl
    };
    suggestion = {
      keyword: "Sorry, we couldn't shorten your URL at this time.",
      subtitle: 'Either this page is not available online, or the API limit has been exceeded.',
      icon: plugin.icon
    };
  }
  window.searchResultsList.innerHTML = ''
  window.currentSearchSuggestions = [suggestion]
  renderSuggestions(window.currentSearchSuggestions)
}

module.exports = plugin;