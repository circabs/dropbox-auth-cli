# dropbox-auth-cli

Fetch the access token of your Dropbox Platform app from the command
line.

## Prerequisites

If you want to work with the Dropbox API, you need an access token.
Access tokens are tied to Dropbox Platform apps, so you first need to
register your app as a Dropbox Platform app:

[https://www.dropbox.com/developers/apps/create](https://www.dropbox.com/developers/apps/create)

## Installation

```
npm install @circa/dropbox-auth-cli -g
```

## CLI Usage

From the command line, run `dbox` and enter your Dropbox
Platform App key and secret.

The Dropbox access token will be stored in `<home>/.config/dropbox.token` file on completion.

## Programmatic Usage

You can run the module programmaticly as well:

```javascript
const DboxAuth = require('@circa/dropbox-auth-cli');

DboxAuth({appKey: 'somekey', appSecret: 'this is a secret'}, (err, token) => {
  console.log('The users token is:' token);
});
```
