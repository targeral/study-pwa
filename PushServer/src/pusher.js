const webpush = require('web-push');
const vapidKeys = require('./keys');

function init() {
  webpush.setVapidDetails(
    'mailto:targeral@outlook.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
}

const triggerPushMsg = function(subscription, dataToSend) {
  return webpush.sendNotification(subscription, dataToSend)
  .catch((err) => {
    if (err.statusCode === 404 || err.statusCode === 410) {
      console.log('Subscription has expired or is no longer valid: ', err);
      return deleteSubscriptionFromDatabase(subscription._id);
    } else {
      throw err;
    }
  });
};

const triggerPushMsgWithoutDelete = function(subscription, dataToSend) {
  return webpush.sendNotification(subscription, dataToSend)
  .catch((err) => {
    if (err.statusCode === 404 || err.statusCode === 410) {
      console.log('Subscription has expired or is no longer valid: ', err);
    } else {
      throw err;
    }
  });
};

module.exports = {
  init,
  triggerPushMsg,
  triggerPushMsgWithoutDelete,
}
