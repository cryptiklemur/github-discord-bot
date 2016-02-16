const AbstractEvent = require('./AbstractEvent');

class IssuesEvent extends AbstractEvent {
    static supports(event) {
        return event === 'issues';
    }

    handle() {
        let issue   = this.request.issue,
            message = '';

        if (this.request.action === 'opened' || this.request.action === 'reopened') {
            message += `**${this.request.repository.name}** - *New Issue* - #${issue.number}\n\`${issue.title}\`\n<${issue.url}>`;
        }

        if (this.request.action === 'closed') {
            message += `**${this.request.repository.name}** - *Issue Closed* - #${issue.number}\n\`${issue.title}\`\n<${issue.url}>`;
        }

        this.client.sendMessage(this.channel, message);
    }
}

module.exports = IssuesEvent;