const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');
const character = document.getElementById('character');
const characterSelect = document.getElementById('character-select');

// Set canvas to full screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    areas = getAreas();
    revealedAreas.clear();
    drawMap();
    drawFog();
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Define areas: {x, y, width, height, id}
function getAreas() {
    const w = canvas.width;
    const h = canvas.height;
    return [
        { x: 0, y: 0, width: w/2, height: h/2, id: 'about' },
        { x: w/2, y: 0, width: w/2, height: h/2, id: 'team' },
        { x: 0, y: h/2, width: w/2, height: h/2, id: 'gallery' },
        { x: w/2, y: h/2, width: w/2, height: h/2, id: 'events' },
        { x: w/4, y: h/4, width: w/2, height: h/2, id: 'merch' } // Overlapping center
    ];
}

let areas = [];
let revealedAreas = new Set();

// Draw map
function drawMap() {
    ctx.fillStyle = '#228B22'; // Forest green
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw simple shapes for areas
    ctx.fillStyle = '#32CD32'; // Lime green for about
    ctx.fillRect(areas[0].x, areas[0].y, areas[0].width, areas[0].height);

    ctx.fillStyle = '#FFD700'; // Gold for team
    ctx.fillRect(areas[1].x, areas[1].y, areas[1].width, areas[1].height);

    ctx.fillStyle = '#FF69B4'; // Hot pink for gallery
    ctx.fillRect(areas[2].x, areas[2].y, areas[2].width, areas[2].height);

    ctx.fillStyle = '#1E90FF'; // Dodger blue for events
    ctx.fillRect(areas[3].x, areas[3].y, areas[3].width, areas[3].height);

    ctx.fillStyle = '#FF4500'; // Orange red for merch
    ctx.fillRect(areas[4].x, areas[4].y, areas[4].width, areas[4].height);
}

// Draw fog
function drawFog() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Clear fog around character
function clearFog(x, y) {
    const radius = 50;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// Check if area is revealed
function checkRevealed() {
    areas.forEach(area => {
        if (revealedAreas.has(area.id)) return;

        // Simple check: if center of area is cleared
        const centerX = area.x + area.width / 2;
        const centerY = area.y + area.height / 2;
        const imageData = ctx.getImageData(centerX, centerY, 1, 1);
        if (imageData.data[3] === 0) { // Alpha 0 means cleared
            revealedAreas.add(area.id);
            showSection(area.id);
        }
    });
}

function showSection(id) {
    const section = document.getElementById(id);
    section.classList.remove('hidden');
}

function hideSection(id) {
    const section = document.getElementById(id);
    section.classList.add('hidden');
}

// Close buttons
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.parentElement;
        hideSection(section.id);
    });
});

// Character selection
characterSelect.addEventListener('change', () => {
    character.textContent = characterSelect.value;
});

// Mouse move
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Move character
    character.style.left = (rect.left + x - 15) + 'px'; // Center emoji
    character.style.top = (rect.top + y - 15) + 'px';

    // Clear fog
    clearFog(x, y);

    // Check revealed
    checkRevealed();
});

// Initialize
areas = getAreas();
drawMap();
drawFog();
character.textContent = characterSelect.value;