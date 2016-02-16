const mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;

const Subscription = new Schema({
    server:     String,
    channel:    String,
    repository: String,
    secret:     String
});

module.exports = mongoose.model('Subscription', Subscription, 'subscriptions');

