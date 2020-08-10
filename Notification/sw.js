const CACHE_ID = 'HAVE_TO_BREAK';
const CACHE_RESOURCE = [
  './',
  './icon.jpg',
  './service/index.js',
  './service/utils.js',
  './app.js',
  './sw.js',
  '././manifest.webmanifest',
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

const checkNotificationPermission = () => Notification.permission;

const runHaveToBreak = ({time = 45}) => {
  if (state.runStatus === RUN_STATUS.NO_RUN) {
    self.registration.showNotification('程序成功运行');
    state.runStatus = RUN_STATUS.RUNNING;
    state.everyTime = time;
    const oneMin = 1000 * 60 / 60;
    const option = {
      body: '你该休息一会儿了',
      icon: './icon.jpg'
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
      icon: './icon.jpg'
    };
    self.registration.showNotification('_(:з」∠)_', option);
  } else {
    console.log('This push event has no data.');
  }
});
