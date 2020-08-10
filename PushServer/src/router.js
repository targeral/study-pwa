const bodyParse = require('body-parser');
const {saveSubscriptionToDatabase, getSubscriptionsFromDatabase} = require('./db');
const {triggerPushMsg} = require('./pusher');
const fuck = require('./fuck');
const isValidSaveRequest = (req, res) => {
  console.log(req.body);
  // Check the request body has at least an endpoint.
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription.
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint.'
      }
    }));
    return false;
  }
  return true;
};


module.exports = app => {
  app.post('/api/save-subscription/', bodyParse.json(), function(req, res) {
    if(isValidSaveRequest(req, res)) {
      return saveSubscriptionToDatabase(req.body)
      .then(function(subscriptionId) {
        console.log('asdfadf')
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ data: { success: true } }));
        fuck();
      })
      .catch(function(err) {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
          error: {
            id: 'unable-to-save-subscription',
            message: 'The subscription was received but we were unable to save it to our database.'
          }
        }));
      });
    }
  });

  app.post('/api/trigger-push-msg/', function(req, res) {
    getSubscriptionsFromDatabase()
    .then(function(subscriptions) {
      console.log(subscriptions)
      let promiseChain = Promise.resolve();

      for (let i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];
        promiseChain = promiseChain.then(() => {
          return triggerPushMsg(subscription, 'hello world');
        });
      }
      console.log('targeral')
      return promiseChain;
    })
    .then(() => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200);
      res.send(JSON.stringify({ data: { success: true } }));
    })
    .catch(function(err) {
      res.status(500);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        error: {
          id: 'unable-to-send-messages',
          message: `We were unable to send messages to all subscriptions : ` +
            `'${err.message}'`
        }
      }));
    });
  })
};
