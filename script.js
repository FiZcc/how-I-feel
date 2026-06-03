// Scroll interaction and environment effects
document.addEventListener('DOMContentLoaded', function() {
  const environments = document.querySelectorAll('.environment');
  const player = document.getElementById('player');
  
  window.addEventListener('scroll', function() {
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    const totalScroll = document.documentElement.scrollHeight - windowHeight;
    const scrollProgress = scrollPos / totalScroll;
    
    // Update each environment's visibility
    environments.forEach((env, index) => {
      const envTop = env.offsetTop;
      const envHeight = env.offsetHeight;
      const envCenter = envTop + envHeight / 2;
      const distanceFromCenter = Math.abs(scrollPos + windowHeight / 2 - envCenter);
      
      // Fade effect
      const opacity = Math.max(0.3, 1 - distanceFromCenter / (windowHeight * 1.2));
      env.style.opacity = opacity;
      
      // Parallax effect on scene elements
      const sceneContainer = env.querySelector('.scene-container');
      if (sceneContainer) {
        const offset = scrollPos * 0.3;
        sceneContainer.style.transform = `translateY(${offset}px)`;
      }
    });
    
    // Audio volume increases with corruption progression
    if (scrollProgress < 0.3) {
      player.volume = 0.1;
    } else if (scrollProgress < 0.6) {
      player.volume = 0.3 + (scrollProgress - 0.3) * 0.33;
    } else {
      player.volume = Math.min(1, 0.5 + (scrollProgress - 0.6) * 1.25);
    }
  });
  
  // Trigger scroll event on load
  window.dispatchEvent(new Event('scroll'));
});

// Spacebar to play/pause
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    const player = document.getElementById('player');
    player.paused ? player.play() : player.pause();
  }
});

// Click anywhere to play music
document.addEventListener('click', function() {
  const player = document.getElementById('player');
  if (player.paused) {
    player.play().catch(() => {
      console.log('Autoplay prevented by browser');
    });
  }
}, { once: true });