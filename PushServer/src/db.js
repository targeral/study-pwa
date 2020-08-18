const path = require('path');
const Datastore = require('nedb');
console.log(path.resolve(__dirname, './data.db'));
const db = new Datastore({
  filename: path.resolve(__dirname, './data.db'),
  autoload: true
});
const ids = [];

function saveSubscriptionToDatabase(subscription) {
  return new Promise(function(resolve, reject) {
    db.insert(subscription, function(err, newDoc) {
      if (err) {
        reject(err);
        return;
      }

      ids.push(newDoc._id);
      resolve(newDoc._id);
    });
  });
};

function getSubscriptionsFromDatabase() {
  console.log(ids);
  return Promise.all(
    ids.map(id => {
      return new Promise((resolve, reject) => {
        db.find({_id: id}, (err, data) => {
          if (err) {
            reject(err);
          }
          console.log('data', data);
          resolve(data[0]);
        });
      });
    })
  );
}

module.exports = {
  saveSubscriptionToDatabase,
  getSubscriptionsFromDatabase,
}
