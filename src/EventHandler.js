const Subscription = require('./Model/Subscription');
const http         = require('http');
const handler      = require('github-webhooker');
const _            = require('lodash');
const issues       = require('require-all')(__dirname + '/Event');

class EventHandler {
    constructor(client, logger) {
        this.client = client;
        this.logger = logger;

        Subscription.find({}, (error, subscriptions) => this.addSubscriptions(error, subscriptions, () => {
            this.logger.info("Starting webserver");
            http.createServer(function (req, res) {
                handler.handle(req, res);
            }).listen(9876);
        }));
    }

    addSubscription(subscription) {
        this.addSubscriptions(null, subscription);
    }

    removeSubscription(subscription) {
        delete handler.repositories[subscription.name];
    }

    addSubscriptions(error, subscriptions, callback) {
        if (error) {
            this.logger.error(error);

            return process.exit(1);
        }

        if (!Array.isArray(subscriptions)) {
            subscriptions = [subscriptions];
        }

        for (let index in subscriptions) {
            if (subscriptions.hasOwnProperty(index)) {
                handler.addRepository(subscriptions[index].repository.split('/')[1], subscriptions[index].secret);
            }
        }

        if (typeof callback === 'function') {
            callback();
        }
    }

    listen() {
        this.logger.info("Listening for all events");

        handler.on('*', event => {
            this.logger.info("New event: ", event);

            Subscription.findOne(
                {repository: event.repository.name, secret: event.repository.secret},
                (err, subscription) => {
                    for (let name in issues) {
                        if (!issues.hasOwnProperty(name) || name === 'AbstractEvent') {
                            continue;
                        }


                        let cls = issues[name];
                        if (cls.supports(event.name)) {
                            return new cls(this.client, subscription, event);
                        }
                    }
                }
            )
        });
    }
}

module.exports = EventHandler;