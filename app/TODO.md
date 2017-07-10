### Must have features before launch
- [] search through all bookmarks
  - implement a `displayAllBookmarks` function.
- [] search through emoji's ....
  - implement a `displayEmoji's` function.

- options page to customize
  - the way the app looks..look at Alfred app for an example of customization options.
  - being able to customize the look & feel of the app is important for users, it seems minor
    but it lets the user take ownership of their experience.
  - allow user to toggle what's part of the default search suggestions.

### Notes

We never modify the the `defaultSearchSuggestions`. When we type in our input, we always search our `defaultSearchSuggestions` for `matches`. Our matches, which is independent of our `defaultSearchSuggestions`,
can have matches or 0 matches. If we have 0 matches, that when we mush fallback content to your `matches` array.


Fuck code optimization right now. The app runs fast, MVP this mofo! Engineering is an iterative process!
