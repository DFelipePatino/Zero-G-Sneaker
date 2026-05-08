// Parallax Effect
const container = document.getElementById('parallax-container');
const sneaker = document.getElementById('sneaker-move');

document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    
    // Smoothly rotate the sneaker container
    sneaker.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

// Particle System
const starsContainer = document.getElementById('stars');
const particleCount = 100;

function createParticles() {
    for (let i = 0; i < particleCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 2 + 1;
        
        // Random animation duration
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `-${delay}s`;
        star.style.opacity = Math.random();
        
        starsContainer.appendChild(star);
    }
}

createParticles();

// Floating Stat Bubbles subtle movement relative to mouse
document.addEventListener('mousemove', (e) => {
    const bubbles = document.querySelectorAll('.stat-bubble');
    const x = (window.innerWidth / 2 - e.pageX) / 50;
    const y = (window.innerHeight / 2 - e.pageY) / 50;
    
    bubbles.forEach(bubble => {
        bubble.style.transform = `translate(${x}px, ${y}px)`;
    });
});
