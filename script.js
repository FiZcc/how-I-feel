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
