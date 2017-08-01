module.exports = {
  keyword: "Disable All Extensions",
  subtitle: 'Disables all active chrome extensions',
  autcomplete: false,
  valid: true,
  action: function() {
    chrome.management.getAll((extensionsAndApps) => {
      const extensions = extensionsAndApps
        .filter((extensionOrApp) => {
          return extensionOrApp.type === 'extension' &&
                 extensionOrApp.name !== "Awesome Task Launcher";
        })

      extensions.forEach((extension) => {
        chrome.management.setEnabled(extension.id, false)
      })
    });
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
