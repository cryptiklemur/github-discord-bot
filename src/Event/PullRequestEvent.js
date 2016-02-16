const AbstractEvent = require('./AbstractEvent');

class PullRequestEvent extends AbstractEvent {
    static supports(event) {
        return event === 'pull_request';
    }

    handle() {
        let event   = this.event,
            pr      = this.request.pull_request,
            message = '';

        if (this.request.action === 'opened' || this.request.action === 'reopened') {
            message += `**${this.request.repository.name}** - *New Pull Request* - #${this.request.number}\n\`${pr.title}\`\n<${pr.url}>`;
        }

        if (this.request.action === 'closed') {
            if (pr.merged) {
                message += `**${this.request.repository.name}** - *Pull Request Merged* - #${this.request.number}\n\`${pr.title}\`\n<${pr.url}>`;
            } else {
                message += `**${this.request.repository.name}** - *Pull Request Closed* - #${this.request.number}\n\`${pr.title}\`\n<${pr.url}>`;
            }
        }
        this.client.sendMessage(this.channel, message);
    }
}

module.exports = PullRequestEvent;