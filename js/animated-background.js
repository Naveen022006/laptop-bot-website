// Futuristic Animated Background with Particles and Parallax
// Performance optimized with Canvas and requestAnimationFrame

class FuturisticBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.gridLines = [];
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.vx = 0;
        this.vy = 0;
        this.animationId = null;
        
        this.init();
    }

    init() {
        // Setup canvas
        this.canvas.id = 'futuristic-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.8';
        this.canvas.style.pointerEvents = 'none';
        
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.resizeCanvas();
        this.createParticles();
        this.createGridLines();
        this.setupEventListeners();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(120, Math.max(60, window.innerWidth / 10));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.5 + 0.3,
                color: this.getRandomColor(),
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    createGridLines() {
        const gridSize = 150;
        const cols = Math.ceil(this.canvas.width / gridSize) + 1;
        const rows = Math.ceil(this.canvas.height / gridSize) + 1;

        for (let i = 0; i < cols; i++) {
            // Vertical lines
            this.gridLines.push({
                type: 'vertical',
                x: i * gridSize,
                offset: 0
            });
        }

        for (let i = 0; i < rows; i++) {
            // Horizontal lines
            this.gridLines.push({
                type: 'horizontal',
                y: i * gridSize,
                offset: 0
            });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(0, 217, 255, ',     // Cyan
            'rgba(88, 101, 242, ',    // Purple
            'rgba(255, 0, 110, ',     // Hot Pink
            'rgba(35, 255, 0, '       // Lime Green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.particles = [];
            this.gridLines = [];
            this.createParticles();
            this.createGridLines();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(this.animationId);
            } else {
                this.animate();
            }
        });
    }

    updateParticles() {
        this.particles.forEach((particle, index) => {
            // Movement
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Parallax effect towards mouse
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const angle = Math.atan2(dy, dx);
                particle.vx += Math.cos(angle) * 0.1;
                particle.vy += Math.sin(angle) * 0.1;
            }

            // Damping
            particle.vx *= 0.98;
            particle.vy *= 0.98;

            // Boundary
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Pulse animation
            particle.pulse += 0.02;
            particle.alpha = 0.3 + Math.sin(particle.pulse) * 0.3;
        });
    }

    drawParticles() {
        this.particles.forEach((particle) => {
            // Draw glow effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 3
            );
            gradient.addColorStop(0, particle.color + '0.6)');
            gradient.addColorStop(1, particle.color + '0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                particle.x - particle.radius * 3,
                particle.y - particle.radius * 3,
                particle.radius * 6,
                particle.radius * 6
            );

            // Draw core
            this.ctx.fillStyle = particle.color + particle.alpha + ')';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawGridLines() {
        this.ctx.strokeStyle = 'rgba(88, 101, 242, 0.15)';
        this.ctx.lineWidth = 1;

        const offsetX = (this.mouseX - window.innerWidth / 2) * 0.02;
        const offsetY = (this.mouseY - window.innerHeight / 2) * 0.02;

        this.gridLines.forEach((line) => {
            if (line.type === 'vertical') {
                const x = line.x + offsetX;
                if (x > -50 && x < this.canvas.width + 50) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, 0);
                    this.ctx.lineTo(x, this.canvas.height);
                    this.ctx.stroke();
                }
            } else {
                const y = line.y + offsetY;
                if (y > -50 && y < this.canvas.height + 50) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, y);
                    this.ctx.lineTo(this.canvas.width, y);
                    this.ctx.stroke();
                }
            }
        });
    }

    animate() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(0.5, '#1a0a2e');
        gradient.addColorStop(1, '#16213e');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid lines
        this.drawGridLines();

        // Update and draw particles
        this.updateParticles();
        this.drawParticles();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FuturisticBackground();
    });
} else {
    new FuturisticBackground();
}
