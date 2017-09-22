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
const usagePageElement = document.querySelector("#page-usage")
const usagePageNavLink = document.querySelector("a[href^='#usage']")
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

router.get('usage', function (request) {
  const otherPages = Array.from(document.querySelectorAll("div[id^='page-']")).filter((el) => el !== usagePageElement)
  otherPages.forEach((page) => page.classList.add('hide'))

  const otherNavLinks = Array.from(document.querySelectorAll("a[href^='#']")).filter((el) => el != usagePageNavLink)
  otherNavLinks.forEach((navLink) => navLink.classList.remove('is-active'))
  usagePageNavLink.classList.add('is-active')


  usagePageElement.classList.remove('hide')
})

router.get('about', function (request) {
  const otherPages = Array.from(document.querySelectorAll("div[id^='page-']")).filter((el) => el !== aboutPageElement)
  otherPages.forEach((page) => page.classList.add('hide'))

  const otherNavLinks = Array.from(document.querySelectorAll("a[href^='#']")).filter((el) => el != aboutPageNavLink)
  otherNavLinks.forEach((navLink) => navLink.classList.remove('is-active'))
  aboutPageNavLink.classList.add('is-active')

  aboutPageElement.classList.remove('hide')
})
