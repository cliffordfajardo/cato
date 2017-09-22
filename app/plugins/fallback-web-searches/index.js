const browser = require('webextension-polyfill')
const fallbackWebSearches = [

  //google search
  function fallbackSearch(query) {

    function search(query) {
      return async function closureFunc() {
        await browser.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(query)}` })
      }
    }

    return {
      keyword: `Search Google for: '${query}'`,
      action: search(query),
      icon: {
        path: 'images/google-search-icon.svg'
      }
    }
  },

  //YouTube
  function fallbackSearch(query) {

    function search(query) {
      return async function closureFunc() {
        await browser.tabs.create({ url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}` })
      }
    }

    return {
      keyword: `Search Youtube for: '${query}'`,
      action: search(query),
      icon: {
        path: 'images/youtube-icon.svg'
      }
    }
  },

  //google maps
  // function fallbackSearch(query) {
  //
  //   function search(query) {
  //     return async function closureFunc() {
  //       await browser.tabs.create({ url: `https://www.google.com/maps?q=${encodeURIComponent(query)}` })
  //     }
  //   }
  //
  //   return {
  //     keyword: `Search Google Maps for: '${query}'`,
  //     action: search(query),
  //     icon: {
  //       path: 'images/google-maps-icon.svg'
  //     }
  //   }
  // },

  //google translate
  // function fallbackSearch(query) {
  //
  //   function search(query) {
  //     return async function closureFunc() {
  //       await browser.tabs.create({ url: `https://translate.google.com/?text=${encodeURIComponent(query)}` })
  //     }
  //   }
  //
  //   return {
  //     keyword: `Search Google Translate for: '${query}'`,
  //     action: search(query),
  //     icon: {
  //       path: 'images/google-translate-icon.png'
  //     }
  //   }
  // },

  //google drive
  function fallbackSearch(query) {

    function search(query) {
      return async function closureFunc() {
        await browser.tabs.create({ url: `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(query)}` })
      }
    }

    return {
      keyword: `Search Google Drive for: '${query}'`,
      action: search(query),
      icon: {
        path: 'images/google-drive-icon.svg'
      }
    }
  },

  //gmail
  function fallbackSearch(query) {

    function search(query) {
      return async function closureFunc() {
        await browser.tabs.create({ url: `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(query)}` })
      }
    }

    return {
      keyword: `Search Gmail for: '${query}'`,
      action: search(query),
      icon: {
        path: 'images/gmail-icon.svg'
      }
    }
  },

  //amazon
  // function fallbackSearch(query) {
  //
  //   function search(query) {
  //     return async function closureFunc() {
  //       await browser.tabs.create({ url: `https://www.amazon.com/s/?url=search-alias%3Daps&field-keywords=${encodeURIComponent(query)}` })
  //     }
  //   }
  //
  //   return {
  //     keyword: `Search Amazon for: '${query}'`,
  //     action: search(query),
  //     icon: {
  //       path: 'images/amazon-icon.svg'
  //     }
  //   }
  // },


  //WikiPedia
  // function fallbackSearch(query) {
  //
  //   function search(query) {
  //     return async function closureFunc() {
  //       await browser.tabs.create({ url: `http://en.wikipedia.org/wiki/${encodeURI(query)}` })
  //     }
  //   }
  //
  //   return {
  //     keyword: `Search Wikipedia for: '${query}'`,
  //     action: search(query),
  //     icon: {
  //       path: 'images/wikipedia-icon.png'
  //     }
  //   }
  // },

  //Github
  // function fallbackSearch(query) {
  //
  //   function search(query) {
  //     return async function closureFunc() {
  //       await browser.tabs.create({ url: `https://github.com/search?utf8=%E2%9C%93&q=${encodeURI(query)}` })
  //     }
  //   }
  //
  //   return {
  //     keyword: `Search Github for: '${query}'`,
  //     action: search(query),
  //     icon: {
  //       path: 'images/wikipedia-icon.png'
  //     }
  //   }
  // },

  //Twitter
  // function fallbackSearch(query) {
  //
  //   function search(query) {
  //     return async function closureFunc() {
  //       await browser.tabs.create({ url: `https://twitter.com/search?q=${encodeURI(query)}` })
  //     }
  //   }
  //
  //   return {
  //     keyword: `Search Twitter for: '${query}'`,
  //     action: search(query),
  //     icon: {
  //       path: 'images/twitter-icon.png'
  //     }
  //   }
  // }
]

module.exports = fallbackWebSearches
