const AbstractEvent = require('./AbstractEvent');

class ReleaseEvent extends AbstractEvent {
    static supports(event) {
        return event === 'push';
    }

    handle() {
        let message = `**${this.request.repository.name}** - *New Release(s)*`;

        message += `${this.request.release.name} - ${this.request.release.body}\n`;
        message += `<${this.request.release.http_url}>`;

        this.client.sendMessage(this.channel, message);
    }
}

module.exports = ReleaseEvent;