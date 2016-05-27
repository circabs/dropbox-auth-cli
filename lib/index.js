'use strict';

const Fs = require('fs');
const Hapi = require('hapi');
const Mkdirp = require('mkdirp');
const Opn = require('opn');
const Path = require('path');


module.exports = (options, callback) => {

    const client_id = options.appKey || process.env.DROPBOX_KEY;
    const appSecret = options.appSecret || process.env.DOPRBOX_SECRET;
    const home = Path.join(process.env.HOMEDRIVE, process.env.HOMEPATH);
    const directory = Path.join(home, '.config');
    const tokenFile = Path.join(directory, 'dropbox.token');
    const port = options.port || 3042;
    const redirect_uri = `http://localhost:${port}/`;

    const server = new Hapi.Server();
    server.connection({
        host: 'localhost',
        port: port
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

            const token = request.url.query.code;
            console.log('Attempting to create path', directory);
            Mkdirp(directory, '0755', (err) => {

                if (err) {
                    return callback(err, null);
                }

                console.log('Attempting to write auth token to', tokenFile);
                Fs.writeFile(tokenFile, new Buffer(token), (err) => {

                    if (err) {
                        return callback(err, null);
                    }
                    console.log('Successfully saved token to location', tokenFile);
                    return reply(token);
                });

            });
        }
    });

    server.route({
        method: 'POST',
        path: '/',
        handler: function (request, reply) {

            const browserUrl = `https://www.dropbox.com/1/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
            console.log('Loading browser url', browserUrl);
            Opn(browserUrl).then(() => {

                reply({ status: 'ok' });
            });

        }
    });

    server.start((err) => {

        if (err) {
            return callback(err, null);
        }

        server.inject({
            method: 'POST',
            url: '/'
        }, (res) => {
            if (process.env.DEBUG) {
                console.log(res.result);
            }
        });
        if (process.env.DEBUG) {
            console.log(`Server started at host ${server.info.host} and listening on port ${server.info.port}`);
        }


    });


};
