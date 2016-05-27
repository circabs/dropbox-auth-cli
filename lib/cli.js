'use strict';


const Bossy = require('bossy');
const Path = require('path');
const Pkg = require('../package.json');
const DropboxAuth = require('./index');

exports.run = (args, cb) => {

    const definition = {
        key: {
            alias: 'k',
            type: 'string',
            description: 'app key'
        },
        secret: {
            alias: 's',
            type: 'string',
            description: 'app secret'
        },
        version: {
            alias: 'v',
            type: 'boolean',
            description: 'version information'
        },
        help: {
            alias: 'h',
            type: 'boolean',
            description: 'display usage options'
        }
    };

    const argv = Bossy.parse(definition, { argv: args });

    if (argv instanceof Error) {
        return cb(new Error(Bossy.usage(definition, argv.message), null));
    }

    if (argv.help) {
        return cb(null, Bossy.usage(definition, 'dropbox-auth-cli [options]'));
    }

    if (argv.version || argv.v) {
        return cb(null, `Package ${Pkg.name} v${Pkg.version}`);
    }

    const options = {};
    if (argv.k && argv.s) {
        options.appKey = argv.k;
        options.appSecret = argv.s;
    }
    else {
        return cb(null, Bossy.usage(definition, 'dropbox-auth-cli [options]'));
    }


    DropboxAuth(options, (err, token) => {

        if (err) {
            return cb(err, null);
        }

        return cb(null, token);

    });


};
