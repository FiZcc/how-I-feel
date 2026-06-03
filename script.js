// Simple scroll-based interactivity
window.addEventListener("scroll", () => {
  const scenes = document.querySelectorAll(".scene");
  const scrollPos = window.scrollY;
  const windowHeight = window.innerHeight;

  scenes.forEach((scene) => {
    const scenePos = scene.offsetTop;
    const distance = scenePos - scrollPos - windowHeight / 2;

    // Add a subtle effect based on scroll position
    const opacity = Math.max(0.5, 1 - Math.abs(distance) / windowHeight);
    scene.style.opacity = opacity;
  });
});
