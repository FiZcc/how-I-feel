// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  const scenes = document.querySelectorAll('.scene');
  const audioPlayer = document.getElementById('player');
  
  // Smooth scroll effect - fade scenes in/out
  window.addEventListener('scroll', function() {
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    
    scenes.forEach((scene, index) => {
      const sceneTop = scene.offsetTop;
      const sceneCenter = sceneTop + windowHeight / 2;
      const distanceFromCenter = Math.abs(scrollPos + windowHeight / 2 - sceneCenter);
      
      // Smooth opacity based on distance from viewport center
      const opacity = Math.max(0.5, 1 - distanceFromCenter / (windowHeight * 1.5));
      scene.style.opacity = opacity;
      
      // Optional: Slightly scale content as it comes into view
      const scale = 0.95 + (opacity - 0.5) * 0.1;
      const contentDiv = scene.querySelector('.content');
      if (contentDiv) {
        contentDiv.style.transform = `scale(${scale})`;
      }
    });
    
    // Audio volume increases as you scroll toward decay sections
    const totalScroll = document.documentElement.scrollHeight - windowHeight;
    const scrollProgress = scrollPos / totalScroll;
    
    // Volume increases in last 2 sections (decay)
    if (scrollProgress > 0.6) {
      const decayProgress = (scrollProgress - 0.6) / 0.4;
      audioPlayer.volume = Math.min(1, 0.3 + decayProgress * 0.7);
    } else {
      audioPlayer.volume = 0.3;
    }
  });
  
  // Trigger initial scroll event
  window.dispatchEvent(new Event('scroll'));
});

// Keyboard shortcut: spacebar to play/pause
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space' && event.target === document.body) {
    event.preventDefault();
    const audioPlayer = document.getElementById('player');
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
  }
});