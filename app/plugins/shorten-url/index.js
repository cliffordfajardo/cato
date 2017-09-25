const browser = require('webextension-polyfill');
const $ = require('jquery');
const plugin = {
    keyword: "Shorten URL",
    subtitle: 'Copies a shortened version of the current url to your clipboard',
    action: shortenUrl,
    icon: {
        path: 'images/chrome-icon.svg'
    }
};

async function shortenUrl() {
    const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true
    });

    const activeTabUrl = tabs[0].url;
    const postUrl = 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyAMSEYpKsnx7pK1I-oKYX7UMC2wumDDjk8'; // Free key allows for 1,000,000 requests per day

    const post = $.ajax({
        url: postUrl,
        type: 'POST',
        dataType: 'json',
        contentType : 'application/json',
        cache: true,
        data: JSON.stringify({
            longUrl: activeTabUrl
        }),
    });

    post.done(data => {
        document.addEventListener('copy', (event) => {
            event.preventDefault();
            event.clipboardData.setData('text/plain', data.id);
        }, { once: true })
        document.execCommand('copy');        
    }).fail(e => {
        console.log('Failed to shorten url: ', activeTabUrl);
    });
}

module.exports = plugin;
