const AbstractEvent = require('./AbstractEvent');

class PushEvent extends AbstractEvent {
    static supports(event) {
        return event === 'push';
    }

    handle() {
        let message = `**${this.request.repository.name}** - *New Commit(s)*\n`;

        message += `${this.request.distinct_size} commit(s) - Head: ${this.request.head_commit.message}\n`;
        message += `<${issue.url}>`;

        this.client.sendMessage(this.channel, message);
    }
}

module.exports = PushEvent;