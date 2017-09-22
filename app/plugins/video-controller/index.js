const browser = require('webextension-polyfill')

const togglePlayVideo = {
  keyword: "Play/Pause",
  subtitle: "Play/Unpause the currently playing video.",
  action: playOrPause,
  icon: {
    path:'images/chrome-icon.svg'
  }
}

async function playOrPause() {
  await browser.tabs.executeScript(null, {
    code: `
      function togglePlayVideo(){
        let video = document.querySelector('video');
        if(video){
          if(video.paused){
            video.play();
          } else {
            video.pause()
          }
        }
      }
      togglePlayVideo()
    `
  })
  window.close()
}


module.exports = togglePlayVideo
