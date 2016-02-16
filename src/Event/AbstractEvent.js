class AbstractEvent {
    constructor(client, subscription, event) {
        this.client       = client;
        this.subscription = subscription;
        this.event        = event;

        this.server  = this.client.servers.get('id', subscription.server);
        this.channel = server.channels.get('id', subscription.channel);
        this.request = event.request.body;

        this.handle();
    }

    static supports(event) {
        throw new Error("Class must override `supports`.");
    }

    handle() {
        throw new Error("Class must override `handle`.");
    }
}

module.exports = AbstractEvent;