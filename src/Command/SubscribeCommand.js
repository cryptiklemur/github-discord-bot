const AbstractCommand = require('discord-bot-base').AbstractCommand;
const Subscription    = require('../Model/Subscription');

class SubscribeCommand extends AbstractCommand {
    static get name() {
        return 'subscribe';
    }

    static get description() {
        return 'Gets and Sets information about the guild members'
    }

    static get help() {
        return `
This command is used to subscribe to github updates. Pass it a channel, and a repository to track.

To subscribe, run:

\`\`\`
subscribe #general aequasi/github-discord-bot
\`\`\`

To unsubscribe, run:

\`\`\`
unsubscribe #general aequasi/github-discord-bot
\`\`\`
`;

    }

    handle() {
        if (this.message.author.id !== this.message.server.owner.id) {
            return false;
        }

        let handler = this.container.get('handler.event');

        this.responds(/^subscribe$/, () => {
            this.reply(SubscribeCommand.help);
        });

        this.responds(/^subscribe <#(\d+)> (\S+) (\S+)$/, matches => {
            let channel    = this.message.server.channels.get('id', matches[1]),
                repository = matches[2],
                secret     = matches[3];

            if (!channel) {
                return this.reply("Cannot subscribe to that channel. Make sure I have permissions to it.");
            }

            Subscription.findOne({channel: channel.id, repository}, (error, subscription) => {
                if (error) {
                    this.reply("There was an error subscribing to that repository.");

                    return this.logger.error(error);
                }

                if (subscription) {
                    return this.reply(channel.mention() + " is already subscribed to https://www.github.com/" + repository);
                }

                subscription = new Subscription({
                    server:     this.message.server.id,
                    channel:    channel.id,
                    repository: repository,
                    secret:     secret
                });

                subscription.save(error => {
                    if (error) {
                        this.reply("There was an error subscribing to that repository.");

                        return this.logger.error(error);
                    }

                    handler.addSubscription(subscription);

                    this.reply(channel.mention() + " is now subscribed to https://www.github.com/" + repository);
                });
            });
        });

        this.responds(/^unsubscribe <#(\d+)> (\S+)$/, matches => {
            let channel    = this.message.server.channels.get('id', matches[1]),
                repository = matches[2];

            Subscription.findOne({channel: channel.id, repository}, (error, subscription) => {
                if (error) {
                    this.reply("There was an error unsubscribing from that repository.");

                    return this.logger.error(error);
                }

                if (!subscription) {
                    return this.reply(channel.mention() + " is not subscribed to https://www.github.com/" + repository);
                }

                handler.removeSubscription(subscription);

                subscription.remove(error => {
                    if (error) {
                        this.reply("There was an error unsubscribing from that repository.");

                        return this.logger.error(error);
                    }

                    this.reply(channel.mention() + " is now unsubscribed from https://www.github.com/" + repository);
                });
            });
        });

    }
}

module.exports = SubscribeCommand;