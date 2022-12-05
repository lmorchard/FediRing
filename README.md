# FediRing

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/lmorchard/fediring)

This is a static site generator that builds a linked ring of verified fediverse profiles.

It's pretty hacky, but it might be fun to play with.

Inspired by both ye olde [Webrings](https://en.wikipedia.org/wiki/Webring) and ye newe [PressCheck.org](https://www.presscheck.org/) for building a discoverable collection of verified fediverse profiles.

## Customization

Most everything you want to customize lives in the `content` directory. That's a good place to start making this thing your own.

## Updates

This project will probably get updated often, here on GitHub:

- https://github.com/lmorchard/FediRing

However, any changes in the `content` directory will clobber your own customizations. The good news is that you can switch to using a local copy with these steps:

1. Copy everything in `content` to `content-local`
1. Copy `.env-example` to `.env` 
2. Ensure that `.env` contains this variable: `CONTENT_PATH="./content-local"`
1. Edit `content-local/profiles.csv` to manage the profiles in your ring.
1. Explore `content-local` to see what else you can change

On a remixed Glitch project, the following commands in a terminal should do the trick:

```
cp -r content content-local
cp .env-example .env
refresh
```

After the above steps, you should be able to import updates without overwriting your customizations in `content`.

That said, you will probably want to compare your copy of `content-local` with the updated `content` to see if you want to pull in any changes by hand.

## Hints & Tips

- You can manage profile addresses in a Google Sheet. Use the File > Share > "Publish to web" menu command to publish your sheet in CSV format. Then, use the given URL as the value of the `FETCH_CSV_URL` env variable.

- Check out `lib/config.js` to see what other environment variables are supported for configuration.

- You can put whatever markdown files you want in `content/pages`. Those files will be published as HTML pages and included in the top navigation bar of the site. Be sure to include some YAML frontmatter to specify a title - see `about.md` for an example.

- If you do something fun with this, [let me know](https://lmorchard.com).

## License

MIT license. Do whatever you want with this thing. Don't blame me if anything goes wrong.
