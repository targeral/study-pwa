import {askPermission, subscribeUserToPush} from './service/index.js';

const RUN_STATUS = {
  RUNNING: 'running',
  NO_RUN: 'no-run',
};
const main = () => {
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const timeSelect = document.getElementById('time-select');
  const resetTime = document.getElementById('reset-time');
  const statusContent = document.getElementById('status-content');
  const pushBtn = document.getElementById('push');
  let state = {
    status: null,
    resetTime: 45,
  };

  const startCounts = () => {
    let counts = 0;
    setInterval(() => {
      counts++;
      resetTime.innerHTML = `还有${state}分钟该休息了。`;
    }, 1000);
  };
  // 本地https下，注意注释掉
  fetch('/current-time')
    .then(res => res.json())
    .then(res => {
      console.log(res);
      if (res.status === RUN_STATUS.RUNNING) {
        resetTime.innerHTML = `还有${res.reset}分钟该休息了。`;
        resetTime.classList.remove('hidden');
      } else {
        statusContent.innerHTML = '你可以选择开始了';
        statusContent.classList.remove('hidden');
      }
      state.status = res.status;
    })

  start.addEventListener('click', () => {
    if (state.status === RUN_STATUS.NO_RUN) {
      const data = {
        time: timeSelect.value
      };
      fetch('/start', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      state.status = RUN_STATUS.RUNNING;
      state.resetTime = timeSelect.value;
      resetTime.innerHTML = `还有${timeSelect.value}分钟该休息了。`;
      resetTime.classList.remove('hidden');
      startCounts();
    }
  });

  stop.addEventListener('click', () => {
    if (state.status === RUN_STATUS.RUNNING) {
      fetch('/stop', {
        method: 'POST',
      });
    }
  });
  pushBtn.addEventListener('click', () => {
    fetch('http://localhost:3000/api/trigger-push-msg/', {
      method: 'POST'
    });
  });
  askPermission();
  subscribeUserToPush();
};


window.addEventListener('load', () => main());

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen

  document.getElementById('btn').addEventListener('click', (e) => {
    console.log('adsfa')
    // hide our user interface that shows our A2HS button
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});
