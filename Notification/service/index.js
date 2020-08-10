import {urlBase64ToUint8Array} from './utils.js';

export function askPermission() {
  if (Notification.permission === 'granted') {
    return Promise.resolve(Notification.permission);
  }

  return Notification.requestPermission().then(permission => {
    if (Notification.permission !== status) {
      Notification.permission = permission;
    }
    return permission;
  });
}

export function subscribeUserToPush() {
  return navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      const options = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BHEf5BU7qKWmWA4RzBOwHQ97eJIgtv5n2sY1i52YDyiFrapxyRbGsrsaOu3RAhFArSnvGrtkco6OEmqkZDNzUU8'
        )
      };

      return registration.pushManager.subscribe(options);
    })
    .then(subscription => {
      return fetch('http://localhost:3000/api/save-subscription/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Bad');
        }

        return response.json();
      })
      .then(res => {
        if (!(res.data && res.data.success)) {
          throw new Error('Bad response from server');
        }
      });
    })
}

function sendSubscriptionToBackEnd(subscription) {
  return fetch('/api/save-subscription/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Bad status code from server.');
    }

    return response.json();
  })
  .then(function(responseData) {
    if (!(responseData.data && responseData.data.success)) {
      throw new Error('Bad response from server.');
    }
  });
}
