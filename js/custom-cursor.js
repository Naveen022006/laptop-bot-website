class CustomCursorEffect {
    constructor() {
        this.mouse = { x: 0, y: 0 };
        this.cursor = null;
        this.cursorDot = null;
        this.trailParticles = [];
        this.isVisible = true;
        this.init();
    }

    init() {
        // Create main cursor element
        this.cursor = document.createElement('div');
        this.cursor.id = 'custom-cursor';
        this.cursor.innerHTML = `
            <svg viewBox="0 0 40 40" width="40" height="40">
                <!-- Outer ring -->
                <circle cx="20" cy="20" r="18" fill="none" stroke="#00D9FF" stroke-width="1.5" opacity="0.8"/>
                <circle cx="20" cy="20" r="15" fill="none" stroke="#5865F2" stroke-width="0.5" opacity="0.5"/>
                
                <!-- Crosshair -->
                <line x1="20" y1="8" x2="20" y2="12" stroke="#00D9FF" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="20" y1="28" x2="20" y2="32" stroke="#00D9FF" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="8" y1="20" x2="12" y2="20" stroke="#00D9FF" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="28" y1="20" x2="32" y2="20" stroke="#00D9FF" stroke-width="1.5" stroke-linecap="round"/>
                
                <!-- Center dot with glow -->
                <defs>
                    <radialGradient id="cursorGlow">
                        <stop offset="0%" style="stop-color:#FF006E;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF006E;stop-opacity:0.3" />
                    </radialGradient>
                </defs>
                <circle cx="20" cy="20" r="4" fill="url(#cursorGlow)" opacity="0.9"/>
                <circle cx="20" cy="20" r="2" fill="#FF006E"/>
            </svg>
        `;
        this.cursor.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 10000;
            left: 0;
            top: 0;
            display: none;
            filter: drop-shadow(0 0 8px rgba(0, 217, 255, 0.6));
        `;
        document.body.appendChild(this.cursor);

        // Create dot element for following effect
        this.cursorDot = document.createElement('div');
        this.cursorDot.id = 'cursor-dot';
        this.cursorDot.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            width: 3px;
            height: 3px;
            background: #00D9FF;
            border-radius: 50%;
            left: 0;
            top: 0;
            display: none;
            box-shadow: 0 0 6px #00D9FF;
            opacity: 0.6;
        `;
        document.body.appendChild(this.cursorDot);

        this.hideNativeCursor();
        this.setupEventListeners();
    }

    hideNativeCursor() {
        document.body.style.cursor = 'none';
        
        // Hide native cursor on all elements
        const style = document.createElement('style');
        style.textContent = `
            * {
                cursor: none !important;
            }
            a, button, [role="button"], input, textarea, select {
                cursor: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseenter', () => this.showCursor());
        document.addEventListener('mouseleave', () => this.hideCursor());
        document.addEventListener('mousedown', () => this.onMouseDown());
        document.addEventListener('mouseup', () => this.onMouseUp());
    }

    onMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        // Update cursor position with smooth lag
        if (this.cursor.style.display !== 'none') {
            this.cursor.style.left = (this.mouse.x - 20) + 'px';
            this.cursor.style.top = (this.mouse.y - 20) + 'px';
        }

        // Update dot with more lag for trail effect
        if (this.cursorDot.style.display !== 'none') {
            setTimeout(() => {
                this.cursorDot.style.left = (this.mouse.x - 1.5) + 'px';
                this.cursorDot.style.top = (this.mouse.y - 1.5) + 'px';
            }, 50);
        }
    }

    onMouseDown() {
        this.cursor.style.transform = 'scale(0.85)';
        this.createTrailParticle();
    }

    onMouseUp() {
        this.cursor.style.transform = 'scale(1)';
    }

    createTrailParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 9998;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, #FF006E 0%, #FF006E 50%, transparent 100%);
            border-radius: 50%;
            left: ${this.mouse.x - 3}px;
            top: ${this.mouse.y - 3}px;
            opacity: 1;
            box-shadow: 0 0 8px #FF006E;
        `;
        document.body.appendChild(particle);

        // Animate particle out
        let opacity = 1;
        let scale = 1;
        const animationInterval = setInterval(() => {
            opacity -= 0.08;
            scale += 0.08;
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${scale})`;

            if (opacity <= 0) {
                clearInterval(animationInterval);
                particle.remove();
            }
        }, 30);
    }

    showCursor() {
        if (!this.isVisible) {
            this.cursor.style.display = 'block';
            this.cursorDot.style.display = 'block';
            this.isVisible = true;
        }
    }

    hideCursor() {
        this.cursor.style.display = 'none';
        this.cursorDot.style.display = 'none';
        this.isVisible = false;
    }

    destroy() {
        if (this.cursor) this.cursor.remove();
        if (this.cursorDot) this.cursorDot.remove();
        document.body.style.cursor = 'auto';
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CustomCursorEffect();
    });
} else {
    new CustomCursorEffect();
}
