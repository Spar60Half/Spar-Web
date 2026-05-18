const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');

canvas.width = 160;
canvas.height = 120;
canvas.tabIndex = 0;
canvas.style.outline = 'none';

const map = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1]
];

let player = {
    x: 5.5,
    y: 5.5,
    angle: 0,
    speed: 0.1
};

const keys = {};
let canvasFocused = false;

window.addEventListener('keydown', function(e) {
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (arrowKeys.includes(e.key)) {
        e.preventDefault();
    }
});

// Solo procesar teclas si el canvas tiene foco
window.addEventListener('keydown', (e) => {
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (arrowKeys.includes(e.key)) {
        if (canvasFocused) {
            keys[e.key] = true;
        }
    }
});

window.addEventListener('keyup', (e) => {
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (arrowKeys.includes(e.key)) {
        keys[e.key] = false;
    }
});

canvas.addEventListener('click', () => {
    canvas.focus();
    canvasFocused = true;
    canvas.style.border = '2px solid #ff6a00';
});

canvas.addEventListener('blur', () => {
    canvasFocused = false;
    for (let key in keys) {
        keys[key] = false;
    }
    canvas.style.border = 'none';
});

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    canvas.focus();
});

function move() {
    if (!canvasFocused) return;
    if (keys['ArrowLeft']) player.angle -= 0.05;
    if (keys['ArrowRight']) player.angle += 0.05;
    
    let moveX = 0, moveY = 0;
    if (keys['ArrowUp']) {
        moveX += Math.cos(player.angle);
        moveY += Math.sin(player.angle);
    }
    if (keys['ArrowDown']) {
        moveX -= Math.cos(player.angle);
        moveY -= Math.sin(player.angle);
    }
    
    if (moveX !== 0 || moveY !== 0) {
        const len = Math.hypot(moveX, moveY);
        moveX /= len;
        moveY /= len;
    }
    
    const newX = player.x + moveX * player.speed;
    const newY = player.y + moveY * player.speed;
    
    if (map[Math.floor(newY)]?.[Math.floor(newX)] === 0) {
        player.x = newX;
        player.y = newY;
    }
}

function getDistance(angle) {
    let dist = 0;
    let x = player.x;
    let y = player.y;
    
    while (dist < 15) {
        x += Math.cos(angle) * 0.1;
        y += Math.sin(angle) * 0.1;
        dist += 0.1;
        
        if (map[Math.floor(y)]?.[Math.floor(x)] === 1) {
            return dist;
        }
    }
    return 15;
}

function render() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let col = 0; col < canvas.width; col++) {
        const angle = player.angle - 0.5 + (col / canvas.width);
        const distance = getDistance(angle);
        const correctedDist = distance * Math.cos(angle - player.angle);
        const wallHeight = Math.min(500, canvas.height / (correctedDist + 0.1));
        const yStart = (canvas.height - wallHeight) / 2;
        const brightness = Math.min(255, Math.floor(300 / (correctedDist + 0.2)));
        ctx.fillStyle = `rgb(${brightness}, ${brightness * 0.7}, ${brightness * 0.4})`;
        ctx.fillRect(col, yStart, 1, wallHeight);
    }
    
    if (!canvasFocused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px monospace';
        ctx.fillText('CLICK PARA JUGAR', 5, 12);
    } else {
        ctx.fillStyle = 'rgba(226, 226, 226, 0.3)';
        ctx.fillRect(0, 0, canvas.width, 20);
        ctx.fillStyle = '#f6ff00';
        ctx.font = '8px monospace';
        ctx.fillText('LISTO!', 5, 12);
    }
}

function gameLoop() {
    move();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
