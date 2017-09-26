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


## Development

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




### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[ci skip]` in the commit description
* Consider starting the commit message with an applicable emoji:
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :penguin: `:penguin:` when fixing something on Linux
    * :apple: `:apple:` when fixing something on macOS
    * :checkered_flag: `:checkered_flag:` when fixing something on Windows
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :green_heart: `:green_heart:` when fixing the CI build
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings



### Pull Requests

- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible.
- End all files with a newline
