const {triggerPushMsgWithoutDelete} = require('./pusher');
const {getSubscriptionsFromDatabase} = require('./db');

const youShouldBreak = () => {
  getSubscriptionsFromDatabase()
    .then(subscriptions => {
      let promiseChain = Promise.resolve();
      for (let i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];
        promiseChain = promiseChain.then(() => {
          return triggerPushMsgWithoutDelete(subscription, '你该休息了');
        });
      }
    });
}

module.exports = function() {
  const time = 1000 * 10
  setInterval(function() {
    youShouldBreak();
  }, time);
}
