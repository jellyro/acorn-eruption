const acorn = document.getElementById('acorn');
const eruptionContainer = document.getElementById('eruption-container');

// Image for erupting faces
const faceImage = 'img/acorn_sperm.png';

// Shake progression variables
let shakeIntensity = 0;
let shakeDuration = 1000; // milliseconds
let progressInterval;
let timeElapsed = 0;
const maxTime = 10000; // 10 seconds until eruption
const accelerationPerClick = 2000; // Speed up by 2 seconds per click
let isErupting = false;

// Start the progressive shaking
function startShaking() {
    acorn.classList.add('acorn-shaking');
    updateShakeIntensity();
    
    progressInterval = setInterval(() => {
        timeElapsed += 100;
        updateShakeIntensity();
        
        // Check if it's time to erupt
        if (timeElapsed >= maxTime) {
            triggerEruption();
        }
    }, 100);
}

// Update shake intensity based on time elapsed
function updateShakeIntensity() {
    const progress = Math.min(timeElapsed / maxTime, 1);
    shakeIntensity = 1 + (progress * 4); // Intensity from 1 to 5
    shakeDuration = 1000 - (progress * 800); // Duration from 1000ms to 200ms
    
    acorn.style.setProperty('--shake-intensity', shakeIntensity);
    acorn.style.setProperty('--shake-duration', `${shakeDuration}ms`);
}

// Click to accelerate the eruption
acorn.addEventListener('click', function(e) {
    // Add a quick shake animation on click
    if (!acorn.classList.contains('acorn-clicked')) {
        acorn.classList.add('acorn-clicked');
        setTimeout(() => {
            acorn.classList.remove('acorn-clicked');
        }, 300); // Match animation duration
    }

    // Speed up the eruption
    timeElapsed += accelerationPerClick;
    updateShakeIntensity();
    
    // If we've reached the max time, erupt immediately
    if (timeElapsed >= maxTime) {
        triggerEruption();
    }
});

// Trigger the eruption
function triggerEruption() {
    if (isErupting) return;
    isErupting = true;
    
    clearInterval(progressInterval);
    acorn.classList.remove('acorn-shaking');
    
    // Get acorn position
    const rect = acorn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create multiple erupting faces
    const numberOfFaces = 20;
    
    for (let i = 0; i < numberOfFaces; i++) {
        setTimeout(() => {
            createEruptingFace(centerX, centerY);
        }, i * 50); // Stagger the eruptions slightly
    }
    
    // Reset after eruption completes
    setTimeout(() => {
        resetAcorn();
    }, 3000);
}

// Reset the acorn to start over
function resetAcorn() {
    isErupting = false;
    timeElapsed = 0;
    shakeIntensity = 0;
    shakeDuration = 1000;
    startShaking();
}

function createEruptingFace(startX, startY) {
    const face = document.createElement('img');
    face.src = faceImage;
    face.className = 'erupting-face';
    
    // Random direction and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = 200 + Math.random() * 400;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const rotation = Math.random() * 720 - 360;
    
    // Set CSS custom properties for animation
    face.style.setProperty('--tx', `${tx}px`);
    face.style.setProperty('--ty', `${ty}px`);
    face.style.setProperty('--rotation', `${rotation}deg`);
    
    // Position at acorn center
    face.style.left = `${startX}px`;
    face.style.top = `${startY}px`;
    
    eruptionContainer.appendChild(face);
    
    // Remove face after animation completes
    setTimeout(() => {
        face.remove();
    }, 2000);
}

// Start the shaking when page loads
startShaking();
