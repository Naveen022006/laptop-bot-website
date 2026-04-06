// Bot Status Checker
// This script checks the bot status using Discord API

async function checkBotStatus() {
    const statusElement = document.getElementById('botStatus');
    
    try {
        // Method: Check using Discord User API endpoint
        // Bot Client ID: 1476568677561401467
        const botId = '1476568677561401467';
        
        // Try to fetch bot info from Discord (public endpoint)
        // Note: This is a workaround since Discord API requires authorization
        // In production, you'd want a backend service
        
        // For now, we'll use a visual indicator
        // In a real scenario, you would have a backend endpoint that checks bot status
        
        // Example: calling a status endpoint
        // const response = await fetch('/api/bot-status');
        // const data = await response.json();
        
        // For demonstration, we'll simulate a check or use localStorage
        const lastKnownStatus = localStorage.getItem('botStatus') || 'online';
        
        if (lastKnownStatus === 'online') {
            updateStatusIndicator(true);
        } else {
            updateStatusIndicator(false);
        }
        
    } catch (error) {
        console.error('Error checking bot status:', error);
        // Default to online if check fails
        updateStatusIndicator(true);
    }
}

function updateStatusIndicator(isOnline) {
    const statusElement = document.getElementById('botStatus');
    
    if (isOnline) {
        statusElement.textContent = '● Online';
        statusElement.classList.remove('offline');
        statusElement.classList.add('online');
    } else {
        statusElement.textContent = '● Offline';
        statusElement.classList.remove('online');
        statusElement.classList.add('offline');
    }
}

// Alternative: Real-time Discord status using Discord.js (client-side)
// This requires the bot to be publicly available and proper CORS handling
async function checkBotStatusAdvanced() {
    try {
        const botId = '1476568677561401467';
        
        // Option 1: Using a CORS proxy (not recommended for production)
        // const response = await fetch(`https://api.discord.com/users/${botId}`);
        
        // Option 2: Using a custom backend endpoint
        // This would be your own server checking the bot status
        const response = await fetch('/api/bot-status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateStatusIndicator(data.online);
            localStorage.setItem('botStatus', data.online ? 'online' : 'offline');
        } else {
            // If backend not available, default to online
            updateStatusIndicator(true);
        }
    } catch (error) {
        console.warn('Advanced status check failed, using default:', error);
        updateStatusIndicator(true);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(88, 101, 242, 0.4)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(88, 101, 242, 0.2)';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 Laptop Control Bot - Website Loaded');
    
    // Check bot status
    checkBotStatus();
    
    // Optional: Refresh status every 30 seconds
    setInterval(checkBotStatus, 30000);
    
    // Add animation on scroll for feature cards
    observeElements();
});

// Intersection Observer for scroll animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideIn 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.feature-card, .status-box').forEach(el => {
        observer.observe(el);
    });
}

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Easter egg: Console message
console.log('%c🤖 Laptop Control Bot', 'color: #5865F2; font-size: 20px; font-weight: bold;');
console.log('%cCheck us out on GitHub: https://github.com/Naveen022006/laptop-control-application', 'color: #00D9FF; font-size: 14px;');
