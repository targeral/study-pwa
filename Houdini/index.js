const paintRipple = () => {
  const example = document.querySelector("#ripple");
  let start = performance.now();
  let x, y;
  document.querySelector("#ripple").addEventListener("click", evt => {
    example.classList.add("animating");
    [x, y] = [evt.clientX, evt.clientY];
    start = performance.now();
    requestAnimationFrame(function raf(now) {
      const count = Math.floor(now - start);
      example.style.cssText = `--ripple-x: ${x}; --ripple-y: ${y}; --animation-tick: ${count};`;
      if (count > 1000) {
        example.classList.remove("animating");
        example.style.cssText = `--animation-tick: 0`;
        return;
      }
      requestAnimationFrame(raf);
    });
  });
};

const animateGaussian = () => {
  const animateName = 'gaussian';
  new WorkletAnimation(
    animateName,
    new KeyframeEffect(
      document.querySelector('#rotation'),
      [
        {
          transform: 'rotateZ(0deg)',
        },
        {
          transform: 'rotateZ(-280deg)',
        },
      ],
      {
        duration: 3000,
        iterations: Number.POSITIVE_INFINITY
      },
    ),
    document.timeline,
    {
      duration: 3000,
      distance: 750
    }
  ).play();

  new WorkletAnimation(
    animateName,
    new KeyframeEffect(
      document.querySelector('#translation'),
      [
        {
          transform: 'translateX(0)',
        },
        {
          transform: 'translateX(750px)'
        }
      ],
      {
        duration: 3000,
        iterations: Number.POSITIVE_INFINITY
      },
    ),
    document.timeline,
    {
      duration: 3000,
      distance: 750,
    }
  ).play();
};

async function init() {
  await CSS.paintWorklet.addModule(
    './paint/ripple.js'
  );
  await CSS.animationWorklet.addModule(
    './animate/gaussian.js'
  );
  paintRipple();
  console.log(CSS.animationWorklet)
  // Check if animationWorklet is supported
  if (!CSS.animationWorklet) {
    document.body.innerHTML = '"AnimationWorklet not supported by this browser"'
    console.log('AnimationWorklet not supported by this browser')
  } else {
    animateGaussian();
  }
}

init();
