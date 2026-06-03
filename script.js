// Smooth scroll-based opacity effects for immersive experience
window.addEventListener("scroll", () => {
  const scenes = document.querySelectorAll(".scene");
  const scrollPos = window.scrollY;
  const windowHeight = window.innerHeight;

  scenes.forEach((scene) => {
    const scenePos = scene.offsetTop;
    const distance = scenePos - scrollPos - windowHeight / 2;

    // Smooth fade in/out based on scroll position
    const opacity = Math.max(0.6, 1 - Math.abs(distance) / windowHeight);
    scene.style.opacity = opacity;
  });
});

// Initialize audio player
window.addEventListener("DOMContentLoaded", () => {
  const audio = document.querySelector(".music-box audio");
  if (audio) {
    // Attempt to autoplay (browsers may block this)
    audio.play().catch(() => {
      console.log("Autoplay blocked - user interaction required");
    });
  }
});
