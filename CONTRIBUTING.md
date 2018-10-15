# Contributing to Cato

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to [Cato](https://github.com/cliffordfajardo/cato). These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.



### Before Submitting an Issue

First, please do a search in open issues to see if the issue or feature request has already been filed. If you find your issue already exists, make relevant comments and add your reaction. Use a reaction in place of a "+1" comment.

- 👍  upvote

- 👎  downvote


### Browser Extension Development Resources

- [Chrome Extension Developer Guide](https://developer.chrome.com/extensions/devguide)
  - When you developing for this repo, please use the `browser` object for commands instead of `chrome` like the other commands in the `/plugins` folder . This allows us to start writing cross-browser extension code that [maybe compatible with other browsers](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) like Firefox in the future.


### Brief Project Structure Overview

All of Cato's commands comes from the `/plugins` folder. Essentially, each command has it's own folder and `index.js` file. Currently, each command is exported as a single Object.

`plugins/plugins.js` is where all all of the commands get loaded into a single
array and  `popup.js` is where they are eventually used.

**If you'd like to contribute a new command** ,  please create a new folder inside `plugins/`. Currently this project uses [async await](https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9) to deal with asynchronous code. When and if you can, please try and use async/await instead of callbacks and promises.


## Installing Prerequisites

You'll need git and a recent version of Node.JS (any v7.2.1+ is recommended with npm v3.10.10+). nvm is also highly recommended.

## Development

Run `npm install` to install all dependencies for the project.

To run the extension locally, you'll need to build it with:

```sh
# Build once
npm run build
```

```sh
# Build every time a file changes
npm run watch
```

Once built, load it in the browser.

### Chrome

1. Visit `chrome://extensions/` in Chrome
2. Enable the **Developer mode**
3. Click on **Load unpacked extension**
4. Select the folder `extension`



## Tips

Once you load the extension, invoke Cato by pressing the icon or command shortcut, you can option click
the popup window and that will bring up the chrome developer tools for inspecting and debugging.

Consider using `debugger` statements in your code. They're useful when you're developing browser extensions.



### Pull Requests

- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible.
- End all files with a newline

To enable us to quickly review and accept your pull requests, always create one pull request per issue and link the issue in the pull request. Never merge multiple requests in one unless they have the same root cause. Be sure to follow our Coding Guidelines and keep code changes as small as possible. Avoid pure formatting changes to code that has not been modified otherwise. Pull requests should contain tests whenever possible.
