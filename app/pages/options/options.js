//Requiring the CSS we will use on this page.
//Webpack will output `options.css` from all these requires
require('./options.scss')
const browser = require('webextension-polyfill')
const themeCustomizerElement = require('../../components/theme-customizer')
const staticCommandPaletteElement = require('../../components/static-command-palette')
const utils = require('../../util.js')
const Grapnel = require('grapnel')
const router = new Grapnel()


const appearancePageElement = document.querySelector('#page-theme')
appearancePageElement.appendChild(staticCommandPaletteElement)
appearancePageElement.appendChild(themeCustomizerElement)


const themePageNavLink = document.querySelector("a[href^='#theming']")
const aboutPageElement = document.querySelector("#page-about")
const aboutPageNavLink = document.querySelector("a[href^='#about']")

//Tab routing for options page
router.get('theming', function(request) {
  const otherPages = Array.from(document.querySelectorAll("div[id^='page-']")).filter((el) => el !== appearancePageElement)
  otherPages.forEach((page) => page.classList.add('hide'))

  const otherNavLinks = Array.from(document.querySelectorAll("a[href^='#']")).filter((el) => el != themePageNavLink)
  otherNavLinks.forEach((navLink) => navLink.classList.remove('is-active'))
  themePageNavLink.classList.add('is-active')

  appearancePageElement.classList.remove('hide')
})


router.get('about', function (request) {
  const otherPages = Array.from(document.querySelectorAll("div[id^='page-']")).filter((el) => el !== aboutPageElement)
  otherPages.forEach((page) => page.classList.add('hide'))

  const otherNavLinks = Array.from(document.querySelectorAll("a[href^='#']")).filter((el) => el != aboutPageNavLink)
  otherNavLinks.forEach((navLink) => navLink.classList.remove('is-active'))
  aboutPageNavLink.classList.add('is-active')

  aboutPageElement.classList.remove('hide')
})

/**
* Google Analytics
* Purpose in Cato app:
* - Used as a counter for tracking cato command usage. This does not track what you write inside the application.
* - For this particular page, I want to see if people are actually using the theme customizer.

* - As the app developer of this app, who is building this app in his spare time at no cost to users,
* I'd like to know how useful this app is to users. Measuring how many times the app is launched gives me an idea how often this
* application is being used.

*/

// // Standard Google Universal Analytics code
(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); // Note: https protocol here

ga('create', 'UA-41444051-3', 'auto'); // Enter your GA identifier
ga('set', 'checkProtocolTask', function () { }); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');
ga('send', 'pageview', '/options.html'); // Specify the virtual path
