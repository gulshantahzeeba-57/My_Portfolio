/* =========================================================
   CUSTOM CURSOR — Optimized Smooth Trailing Cursor
========================================================= */
(function () {
  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  var ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';
  document.body.appendChild(ring);
  document.body.appendChild(dot);
  document.body.classList.add('custom-cursor-active');

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var ringX = mouseX;
  var ringY = mouseY;
  var visible = false;
  var isRunning = false;

  function render() {
    // Smooth transform with hardware acceleration translate3d
    dot.style.transform = 'translate3d(' + mouseX + 'px, ' + mouseY + 'px, 0) translate(-50%, -50%)';
    
    // Smooth trailing ring lerp
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;
    ring.style.transform = 'translate3d(' + ringX + 'px, ' + ringY + 'px, 0) translate(-50%, -50%)';

    // Continue loop only when moving or visible
    if (visible || Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
      requestAnimationFrame(render);
    } else {
      isRunning = false;
    }
  }

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!visible) {
      visible = true;
      dot.classList.add('visible');
      ring.classList.add('visible');
    }

    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(render);
    }
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    visible = false;
    dot.classList.remove('visible');
    ring.classList.remove('visible');
  });

  document.addEventListener('mousedown', function () {
    ring.classList.add('pressed');
  });
  
  document.addEventListener('mouseup', function () {
    ring.classList.remove('pressed');
  });

  var hoverTargets = 'a, button, input, textarea, select, .pill, .lanyard-card, [role="button"]';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(hoverTargets)) ring.classList.add('hover');
  }, { passive: true });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(hoverTargets)) ring.classList.remove('hover');
  }, { passive: true });
})();