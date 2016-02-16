const AbstractEvent = require('./AbstractEvent');

class IssuesEvent extends AbstractEvent {
    static supports(event) {
        return event === 'issues';
    }

    handle() {
        let issue = this.request.issue,
            message = '';

        if (this.request.action === 'opened' || this.request.action === 'reopened') {
            message += `**New Issue** - *${event.repository.name}* - #${issue.number}\n\`${issue.title}\`\n<${issue.url}>`;
        }

        if (this.request.action === 'closed') {
            message += `**Issue Closed** - *${event.repository.name}* - #${issue.number}\n\`${issue.title}\`\n<${issue.url}>`;
        }

        this.client.sendMessage(this.channel, message);
    }
}

module.exports = IssuesEvent;