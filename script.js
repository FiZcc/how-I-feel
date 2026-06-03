class InteractiveWorld {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
    
    // Corruption state (0-100)
    this.corruption = 0;
    this.targetCorruption = 0;
    
    // Mouse interaction
    this.mouseX = canvas.width / 2;
    this.mouseY = canvas.height / 2;
    this.isMouseDown = false;
    
    // Particles and elements
    this.grass = [];
    this.flowers = [];
    this.particles = [];
    this.butterflies = [];
    this.raindrops = [];
    
    this.initializeWorld();
    this.setupEventListeners();
    this.animate();
    this.autoCorrupt();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  initializeWorld() {
    // Create grass
    for (let i = 0; i < 150; i++) {
      this.grass.push({
        x: Math.random() * this.canvas.width,
        y: this.canvas.height - 50 + Math.random() * 50,
        height: 30 + Math.random() * 20,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.02,
        baseX: 0,
        vx: 0,
        originalHeight: 30 + Math.random() * 20
      });
      this.grass[i].baseX = this.grass[i].x;
    }
    
    // Create flowers
    for (let i = 0; i < 8; i++) {
      this.flowers.push({
        x: 100 + i * (this.canvas.width / 8),
        y: this.canvas.height - 100,
        health: 100,
        size: 40,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03 + Math.random() * 0.02,
        petals: ['🌼', '🌸', '🌺', '🌻', '🌷'][i % 5]
      });
    }
    
    // Create butterflies
    for (let i = 0; i < 5; i++) {
      this.butterflies.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        angle: Math.random() * Math.PI * 2,
        wingFlap: 0,
        alive: true
      });
    }
  }
  
  setupEventListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    
    window.addEventListener('mousedown', () => {
      this.isMouseDown = true;
    });
    
    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
    
    window.addEventListener('click', (e) => {
      this.handleClick(e.clientX, e.clientY);
    });
    
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }
  
  handleClick(x, y) {
    // Check if clicking on flowers
    for (let flower of this.flowers) {
      const dist = Math.hypot(x - flower.x, y - flower.y);
      if (dist < 50) {
        flower.health = Math.max(0, flower.health - 20);
        this.targetCorruption = Math.min(100, this.targetCorruption + 5);
      }
    }
    
    // Create particle burst
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        life: 60,
        maxLife: 60,
        color: this.corruption > 50 ? '#8B0000' : '#FFD700'
      });
    }
  }
  
  autoCorrupt() {
    // Gradually increase corruption over time
    setInterval(() => {
      if (this.corruption < 100) {
        this.targetCorruption = Math.min(100, this.targetCorruption + 0.5);
      }
    }, 100);
  }
  
  updateGrass() {
    for (let blade of this.grass) {
      blade.sway += blade.swaySpeed;
      
      // Distance from mouse
      const dist = Math.hypot(this.mouseX - blade.x, this.mouseY - blade.y);
      const maxDist = 150;
      
      if (dist < maxDist) {
        const force = (maxDist - dist) / maxDist;
        const angle = Math.atan2(blade.y - this.mouseY, blade.x - this.mouseX);
        blade.vx = Math.cos(angle) * force * 3;
      } else {
        blade.vx *= 0.95;
      }
      
      blade.x = blade.baseX + blade.vx + Math.sin(blade.sway) * 3;
      
      // Wilt based on corruption
      blade.height = blade.originalHeight * (1 - this.corruption / 200);
    }
  }
  
  updateFlowers() {
    for (let flower of this.flowers) {
      flower.wobble += flower.wobbleSpeed;
      flower.health -= this.corruption * 0.01;
      flower.health = Math.max(0, flower.health);
    }
  }
  
  updateButterflies() {
    for (let butterfly of this.butterflies) {
      if (!butterfly.alive) continue;
      
      // Random wandering
      butterfly.vx += (Math.random() - 0.5) * 0.1;
      butterfly.vy += (Math.random() - 0.5) * 0.1;
      
      // Flee from mouse when corruption is low
      if (this.corruption < 30) {
        const dist = Math.hypot(this.mouseX - butterfly.x, this.mouseY - butterfly.y);
        if (dist < 200) {
          const angle = Math.atan2(butterfly.y - this.mouseY, butterfly.x - this.mouseX);
          butterfly.vx += Math.cos(angle) * 0.3;
          butterfly.vy += Math.sin(angle) * 0.3;
        }
      } else {
        // Die as corruption increases
        if (Math.random() < this.corruption / 5000) {
          butterfly.alive = false;
        }
      }
      
      // Clamp velocity
      butterfly.vx = Math.max(-2, Math.min(2, butterfly.vx));
      butterfly.vy = Math.max(-2, Math.min(2, butterfly.vy));
      
      butterfly.x += butterfly.vx;
      butterfly.y += butterfly.vy;
      
      butterfly.wingFlap += 0.1;
      
      // Keep in bounds
      if (butterfly.x < 0) butterfly.x = this.canvas.width;
      if (butterfly.x > this.canvas.width) butterfly.x = 0;
      if (butterfly.y < 0) butterfly.y = this.canvas.height;
      if (butterfly.y > this.canvas.height) butterfly.y = 0;
    }
  }
  
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.life--;
      
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  updateCorruption() {
    // Smooth corruption transition
    this.corruption += (this.targetCorruption - this.corruption) * 0.05;
    
    // Update audio volume and UI
    const player = document.getElementById('player');
    player.volume = Math.min(1, this.corruption / 150);
    
    // Update status
    this.updateStatus();
  }
  
  updateStatus() {
    const percent = Math.floor(this.corruption);
    document.getElementById('corruption-percent').textContent = percent;
    document.getElementById('corruption-fill').style.width = percent + '%';
    
    const statusBox = document.querySelector('.status-box');
    
    if (percent < 25) {
      document.getElementById('title').textContent = 'soft bloom';
      document.getElementById('message').textContent = 'a place of flowers, light, and quiet air';
      statusBox.classList.remove('corrupted');
    } else if (percent < 50) {
      document.getElementById('title').textContent = 'gentle growth';
      document.getElementById('message').textContent = 'everything feels safe... too safe';
      statusBox.classList.remove('corrupted');
    } else if (percent < 75) {
      document.getElementById('title').textContent = 'something shifts';
      document.getElementById('message').textContent = 'the colors hesitate';
      statusBox.classList.remove('corrupted');
    } else if (percent < 90) {
      document.getElementById('title').textContent = 'corruption';
      document.getElementById('message').textContent = 'red spreads where it shouldn\'t';
      statusBox.classList.add('corrupted');
    } else {
      document.getElementById('title').textContent = 'ruin';
      document.getElementById('message').textContent = 'nothing stays clean anymore';
      statusBox.classList.add('corrupted');
    }
  }
  
  draw() {
    // Background gradient based on corruption
    const startColor = this.lerpColor('#d6ffd6', '#000000', this.corruption / 100);
    const endColor = this.lerpColor('#ffffff', '#8B0000', this.corruption / 100);
    
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw stains/corruption
    if (this.corruption > 20) {
      this.drawStains();
    }
    
    // Draw grass
    this.drawGrass();
    
    // Draw flowers
    this.drawFlowers();
    
    // Draw butterflies
    this.drawButterflies();
    
    // Draw particles
    this.drawParticles();
    
    // Draw rain/corruption effect
    if (this.corruption > 50) {
      this.drawRain();
    }
  }
  
  drawGrass() {
    this.ctx.strokeStyle = this.lerpColor('#228B22', '#8B4513', this.corruption / 100);
    this.ctx.lineWidth = 2;
    
    for (let blade of this.grass) {
      this.ctx.beginPath();
      this.ctx.moveTo(blade.x, blade.y);
      const bendAngle = Math.sin(blade.sway) * 0.2;
      this.ctx.lineTo(
        blade.x + Math.sin(bendAngle) * 10,
        blade.y - blade.height
      );
      this.ctx.stroke();
    }
  }
  
  drawFlowers() {
    for (let flower of this.flowers) {
      const opacity = flower.health / 100;
      const x = flower.x + Math.sin(flower.wobble) * 5;
      const y = flower.y + Math.cos(flower.wobble) * 3;
      
      this.ctx.globalAlpha = opacity;
      this.ctx.font = `${flower.size * (opacity * 0.8 + 0.2)}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      if (flower.health > 50) {
        this.ctx.fillText(flower.petals, x, y);
      } else if (flower.health > 0) {
        this.ctx.fillText('🥀', x, y);
      } else {
        this.ctx.fillText('☠️', x, y);
      }
    }
    this.ctx.globalAlpha = 1;
  }
  
  drawButterflies() {
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    for (let butterfly of this.butterflies) {
      if (!butterfly.alive) continue;
      
      this.ctx.save();
      this.ctx.translate(butterfly.x, butterfly.y);
      this.ctx.rotate(Math.atan2(butterfly.vy, butterfly.vx));
      this.ctx.fillText('🦋', 0, 0);
      this.ctx.restore();
    }
  }
  
  drawParticles() {
    for (let p of this.particles) {
      const alpha = p.life / p.maxLife;
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }
  
  drawStains() {
    const stainOpacity = Math.min(0.6, this.corruption / 100);
    this.ctx.globalAlpha = stainOpacity;
    this.ctx.fillStyle = '#8B0000';
    
    // Random stain positions based on corruption
    for (let i = 0; i < Math.floor(this.corruption / 10); i++) {
      const seed = i * 12345;
      const x = (Math.sin(seed) * this.canvas.width * 0.5 + this.canvas.width * 0.5);
      const y = (Math.cos(seed * 2) * this.canvas.height * 0.5 + this.canvas.height * 0.5);
      const size = 50 + Math.sin(seed * 3) * 30;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.globalAlpha = 1;
  }
  
  drawRain() {
    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    this.ctx.lineWidth = 1;
    
    const rainIntensity = (this.corruption - 50) / 50;
    
    for (let i = 0; i < Math.floor(rainIntensity * 100); i++) {
      const x = (Math.sin(i * 0.1 + this.corruption) * this.canvas.width) % this.canvas.width;
      const y = (i * 5 + this.corruption * 2) % this.canvas.height;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x - 2, y + 10);
      this.ctx.stroke();
    }
  }
  
  lerpColor(color1, color2, t) {
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);
    
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
  
  animate() {
    this.updateGrass();
    this.updateFlowers();
    this.updateButterflies();
    this.updateParticles();
    this.updateCorruption();
    
    this.draw();
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  new InteractiveWorld(canvas);
});