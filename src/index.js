'use strict';

const pkg              = require('../package');
const Bot              = require('./Bot');
const SubscribeCommand = require('./Command/SubscribeCommand');
const EventHandler     = require('./EventHandler');

let options = {
    admin_id:  process.env.DISCORD_ADMIN_ID,
    email:     process.env.DISCORD_EMAIL,
    password:  process.env.DISCORD_PASSWORD,
    name:      pkg.name,
    version:   pkg.version,
    author:    pkg.author,
    commands:  [SubscribeCommand],
    prefix:    ":",
    mongo_url: process.env.DISCORD_MONGO_URL,
    redis_url: process.env.DISCORD_REDIS_URL,
    container: Bot => {
        return {
            services: {
                'handler.event': {module: EventHandler, args: [{$ref: 'client'}, {$ref: 'logger'}]}
            }
        }
    }
};

let environment = 'prod';
if (process.env.DISCORD_ENV !== undefined) {
    environment = process.env.DISCORD_ENV;
}

new Bot(environment, false && environment === 'dev', options);
