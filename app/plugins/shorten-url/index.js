const browser = require('webextension-polyfill');
const {copyToClipboard, renderSuggestions} = require('../../util');

const iconUrl = 'images/shortened-url-icon.svg';

module.exports = {
  keyword: "Shorten URL",
  subtitle: 'Shorten the current url.',
  action: shortenUrl,
  icon: {
    path: iconUrl
  }
};

async function shortenUrl() {
  const tabs = await browser.tabs.query({active: true,currentWindow: true});

  const activeTabUrl = tabs[0].url;
  const postUrl = 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyAMSEYpKsnx7pK1I-oKYX7UMC2wumDDjk8'; // Free key allows for 1,000,000 requests per day
  
  const request = new Request(postUrl, {
    'method': 'POST',
    'body': JSON.stringify({longUrl: activeTabUrl}),
    'mode': 'cors',
    'headers': new Headers({'Content-Type': 'application/json'})
  })
  
  const data = await (await fetch(request)).json();
  const suggestion = null;
  if (data.id) {
    suggestion = {
        keyword: `${data.id}`,
        subtitle: 'Copy shortened url to your clipboard.',
        action: () => {
          copyToClipboard(data.id, ev => {
              window.close();
          });
        },
        icon: {
          path: iconUrl
        }
      }
  } else {
    suggestion = {
        keyword: "Sorry, we couldn't shorten your URL at this time.",
        action: 'The network must be down or our API limit has exceeded.',
        subtitle: 'Please try again later.',
        icon: {
          path: iconUrl
        }
      }
  }
  renderSuggestions([suggestion]);
}
