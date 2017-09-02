//Requiring the CSS we will use on this page.
//Webpack will output `options.css` from all these requires
require('./options.scss')
const browser = require('webextension-polyfill')
const {h} = require('dom-chef')
const themeCustomizerElement = require('../../components/theme-customizer')
const staticCommandPaletteElement = require('../../components/static-command-palette')
const utils = require('../../util.js')
const Grapnel = require('grapnel')
const router = new Grapnel()



const appearancePageElement = document.querySelector('#page-appearance')
appearancePageElement.appendChild(staticCommandPaletteElement)
appearancePageElement.appendChild(themeCustomizerElement)

const pluginsPageElement = document.querySelector('#page-plugins')
const usagePageElement = document.querySelector('#page-usage')
const aboutPageElement = document.querySelector('#page-about')


router.get('appearance', function(request) {
  const otherPages = Array.from(document.querySelectorAll("div[id^='page-']")).filter((el) => el !== appearancePageElement)
  otherPages.forEach((page) => page.classList.add('hide'))
  appearancePageElement.classList.remove('hide')
})

router.get('plugins', function(request) {
  const otherPages = Array.from(document.querySelectorAll("div[id^='page-']")).filter((el) => el !== pluginsPageElement)
  otherPages.forEach((page) => page.classList.add('hide'))
  pluginsPageElement.classList.remove('hide')
})

router.get('usage', function (request) {
  const otherPages = Array.from(document.querySelectorAll("div[id^='page-']")).filter((el) => el !== usagePageElement)
  otherPages.forEach((page) => page.classList.add('hide'))
  usagePageElement.classList.remove('hide')
})

router.get('about', function (request) {
  const otherPages = Array.from(document.querySelectorAll("div[id^='page-']")).filter((el) => el !== aboutPageElement)
  otherPages.forEach((page) => page.classList.add('hide'))
  aboutPageElement.classList.remove('hide')
})
