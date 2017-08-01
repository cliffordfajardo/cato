module.exports = {
  keyword: 'Bookmark/Unbookmark page',
  subtitle: 'Bookmark the page if it\'s not bookmarked, otherwise unbookmark it.',
  autocomplete: false,
  valid: true,
  action: function () {
   chrome.tabs.query({'active': true, currentWindow: true}, (tabs) => {
     const activeTab = tabs[0];
     // Since each bookmark url is unique, we can use the current tab's url to find if we bookmarked the tab already.
     chrome.bookmarks.search({url: activeTab.url}, (bookmarks) => {
       if(bookmarks.length === 0) {
         chrome.bookmarks.create({title: activeTab.title, url: activeTab.url});
       }
       else {
         // apparently, you can bookmark the same page in a different tab.
         bookmarks.forEach((bookmark) => chrome.bookmarks.remove(bookmark.id))
       }
     });
   })
 },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
