# Fediverse Webrings

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/lmorchard/fediverse-webrings)

This is a half-baked idea to build a webring of verified fediverse profiles for whatever purpose one sees fit.

## TODO

- build with Github Actions, publish to Github Pages

- download and resize profile images locally during fetch rather than hotlinking

- paginate profiles

- support organizing profiles by tags, build tag pages

- export from mastodon list API (like blogrolls?)

- accept import from
  - URL to CSV resource
  - Mastodon list CSV export
  - Mastodon list API (?)

- activitypub bot
  - accept DMs for application
  - web UI or DMs for management?
  - serve up CSV at URL to decouple bot from static site
