(function smoothEllipticalScroll() {
  // Configuration
  const scrollStep = window.innerHeight * 0.9;    // Distance per step
  const scrollDuration = 3000;                    // Scroll down duration (ms)
  const scrollBackDuration = 800;                 // Scroll up duration (ms)
  const pauseDelay = 1000;                        // Pause between steps (ms)
  const topPauseDelay = 10000;                    // Extra pause at top (ms)
  const easingFunction = easeInOutQuadSlow;       // Ultra-smooth easing

  let isScrollingDown = true;

  // Easing function for slow accel/decel
  function easeInOutQuadSlow(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateScroll(start, end, duration, callback) {
    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easingFunction(t);
      const position = start + (end - start) * eased;

      window.scrollTo(0, position);

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        callback();
      }
    }

    requestAnimationFrame(frame);
  }

  function scrollStepLoop() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const current = window.scrollY;

    if (isScrollingDown) {
      const target = Math.min(current + scrollStep, maxScroll);

      animateScroll(current, target, scrollDuration, () => {
        if (target >= maxScroll) {
          isScrollingDown = false;
          setTimeout(() => {
            animateScroll(window.scrollY, 0, scrollBackDuration, () => {
              isScrollingDown = true;
              setTimeout(scrollStepLoop, topPauseDelay); // ⏸️ Long pause at top
            });
          }, pauseDelay);
        } else {
          setTimeout(scrollStepLoop, pauseDelay);
        }
      });
    }
  }

  scrollStepLoop();
})();
