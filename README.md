# meme-fetcher

This npm package is designed to make fetching memes from reddit really easy to do.

## Installation

```
npm i meme-fetcher
```

or, alternatively if you use yarn:

```
yarn add meme-fetcher
```

## Usage

```js
const getMeme = require("meme-fetcher").default;
// or with TypeScript:
import getMeme from "meme-fetcher";

(async () => {
    console.log(await getMeme({ type: "meme" }));
})();
```

## Types of Requests

Currently there are two types: `meme` and `wallpaper`.
There is also a custom type that allows you to specify your own subreddit list.
All types allow you to add to or remove from the subreddit list as you wsh with the `addSubs` and `removeSubs` options.

If you want to add more types, feel free to add another item to [`src/config.json`](https://github.com/dheerajpv/meme-fetcher/blob/master/src/config.json) and send a PR my way!

**Note:** The `custom` type can be really problematic if you give it a subreddit with a large number of non-image posts. The function will throw an error if that's the case (as seen below).

## Error Handling

There is a chance that the API will return a post that is not an image.
Many subreddits have pinned posts with text, or just not a meme-oriented sub in general.
If a text post (or more accurately, a non-image or video post) is recieved, an error will be thrown.
If you choose, you can put a call to this function in a `do/while` loop to get an image _sooner or later_.
