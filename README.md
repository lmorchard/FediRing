# FediRing

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/lmorchard/ringofedi)

This is a static site generator that builds a linked ring of verified fediverse profiles.

It's pretty hacky, but it might be fun to play with.

## Customization

Most everything you want to customize lives in the `content` directory. You can make this thing your own with the following steps:

1. Copy everything in `content` to `content-local`
1. Copy `.env-example` to `.env`
1. Edit `content-local/profiles.csv` to manage the profiles in your ring.
1. Explore `content-local` to see what else you can change

## Updates

This project will probably get updated often at this git repository:

- https://github.com/lmorchard/FediRing

If you have made your own copy of the `content` directory, you should be able to import updates without overwriting your customizations.

That said, you will probably want to compare your copy of `content-local` with the updated `content` to see if you want to pull in any changes by hand.

## Hints & Tips

- If you do something fun with this, [let me know](https://lmorchard.com).

- You can put whatever markdown files you want in `content/pages`.

  Those files will be turned into HTML pages and included in the top navigation bar of the site. Be sure to include some YAML frontmatter to specify a title - see `about.md` for an example.

## License

MIT license. Do whatever you want with this thing. Don't blame me if anything goes wrong.

## TODO

- build with Github Actions, publish to Github Pages

- download and resize profile images locally during fetch rather than hotlinking

- paginate profiles

- support organizing profiles by tags, build tag pages

- accept import from
  - URL to CSV resource maintained by separate tool
  - Mastodon list API (?)

- activitypub bot
  - accept DMs for application
  - web UI or DMs for management?
  - serve up CSV at URL to decouple bot from static site
