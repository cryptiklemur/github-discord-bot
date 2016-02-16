'use strict';

const BaseBot      = require('discord-bot-base').Bot;

class Bot extends BaseBot {
    onReady() {
        super.onReady();

        this.container.get('handler.event').listen();
    }
}

module.exports = Bot;