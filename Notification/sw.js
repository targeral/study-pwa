console.log('asdf')
const CACHE_ID = 'HAVE_TO_BREAK';
const CACHE_RESOURCE = [
  './',
  './icon/icon.jpg',
  './service/index.js',
  './service/utils.js',
  './app.js',
  './sw.js',
  './manifest.webmanifest',
  './js13kpwa.webmanifest',
  './tailwind.min.css',
];
const RUN_STATUS = {
  RUNNING: 'running',
  NO_RUN: 'no-run',
};
const state = {
  timer: null,
  starTime: 0,
  everyTime: 0,
  runStatus: RUN_STATUS.NO_RUN,
}

self.addEventListener('install', function(event) {
  // Perform install steps
  // cache resource
  event.waitUntil(
    caches.open(CACHE_ID)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(CACHE_RESOURCE);
      })
  );
});

self.addEventListener('activate', function(event) {
  console.log('activate');
  const runAllTime = new Promise((resolve, reject) => {
  });
  // event.waitUntil(runAllTime())
});

const checkNotificationPermission = () => Notification.permission;

const runHaveToBreak = ({time = 45}) => {
  if (state.runStatus === RUN_STATUS.NO_RUN) {
    self.registration.showNotification('程序成功运行');
    state.runStatus = RUN_STATUS.RUNNING;
    state.everyTime = time;
    const oneMin = 1000 * 60 / 60;
    const option = {
      body: '你该休息一会儿了',
      icon: './icon/icon.jpg'
    };
    state.starTime = new Date();
    state.timer = setInterval(() => {
      if (checkNotificationPermission()) {
        self.registration.showNotification('_(:з」∠)_', option);
        state.starTime = new Date();
      }
    }, time * oneMin);
  }
};

const stopHaveToBreak = () => {
  if (state.runStatus === RUN_STATUS.RUNNING) {
    state.runStatus = RUN_STATUS.NO_RUN;
    state.everyTime = 0;
    clearInterval(state.timer);
  }
};
const getResetTime = () => {
  if (state.runStatus === RUN_STATUS.RUNNING) {
    return JSON.stringify({
      status: RUN_STATUS.RUNNING,
      reset: state.everyTime - new Date(new Date() - state.starTime).getMinutes(),
      content: 'you can stop',
    });
  } else {
    return JSON.stringify({
      status: RUN_STATUS.NO_RUN,
      reset: 0,
      content: 'you can start',
    });
  }
};

const isCurrentResetTimeFetch = (url) => {
  return url.includes('current-time');
};
const isStartFetch = (url) => {
  return url.includes('start');
};
const isStopFetch = (url) => {
  return url.includes('stop');
};
const fetchRouterWithoutCache = (request) => {
  console.log(request);
  if (isStartFetch(request.url)) {
    return request.json().then(res => {
      runHaveToBreak(res);
      return new Response('start success', {
        status: 200,
      });
    });
    // return new Response('start success', {
    //   status: 200,
    // });
  }
  if (isStopFetch(request.url)) {
    stopHaveToBreak();
    return new Response('stop success', {
      status: 200,
    });
  }
  if (isCurrentResetTimeFetch(request.url)) {
    return new Response(getResetTime(), {
      status: 200,
    });
  }

  return fetch(request);
};

self.addEventListener('fetch', function(event) {
  // console.log('fetch', event.request);
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        // 针对于缓存资源的请求
        if (response) {
          return response;
        }
        // 针对其他请求
        return fetchRouterWithoutCache(event.request);
      }
    )
  );
});

self.addEventListener('push', function(event) {
  if (event.data) {
    const option = {
      body: event.data.text(),
      icon: './icon/icon.jpg'
    };
    self.registration.showNotification('_(:з」∠)_', option);
  } else {
    console.log('This push event has no data.');
  }
});


// notification click
self.addEventListener('notificationclick', function(event) {
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Do something as the result of the notification click
  const promiseChain = doSomething();
  event.waitUntil(promiseChain);
});

// or click notification action
self.addEventListener('notificationclick', function(event) {
  if (!event.action) {
    // Was a normal notification click
    console.log('Notification Click.');
    return;
  }

  switch (event.action) {
    case 'coffee-action':
      console.log('User ❤️️\'s coffee.');
      break;
    case 'doughnut-action':
      console.log('User ❤️️\'s doughnuts.');
      break;
    case 'gramophone-action':
      console.log('User ❤️️\'s music.');
      break;
    case 'atom-action':
      console.log('User ❤️️\'s science.');
      break;
    default:
      console.log(`Unknown action clicked: '${event.action}'`);
      break;
  }
});

self.addEventListener('notificationclose', function(event) {
  const dismissedNotification = event.notification;

  const promiseChain = notificationCloseAnalytics();
  event.waitUntil(promiseChain);
});

self.addEventListener('beforeinstallprompt', () => {
  console.log('beforeinstallprompt');
});
