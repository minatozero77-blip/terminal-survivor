const board = document.getElementById('board');
const svg = document.getElementById('lines-layer');
const status = document.getElementById('status');
let posisi = 1;
let isMoving = false;

const ular = { 17: 7, 54: 34, 62: 19, 98: 79 };
const tangga = { 3: 38, 24: 44, 42: 63, 71: 91 };

// Fungsi Suara (Klik, Lompat, Tangga, Ular)
function playSound(freq, type, duration = 0.1) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + duration);
}

function init() {
    board.innerHTML = "";
    for (let i = 100; i >= 1; i--) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${i}`;
        cell.innerText = i;
        board.appendChild(cell);
    }
    if(!document.getElementById('player')) {
        const p = document.createElement('div');
        p.id = 'player';
        document.querySelector('.board-wrapper').appendChild(p);
    }
    setTimeout(() => { renderLines(); updatePlayerPos(1); }, 500);
}

function renderLines() {
    svg.innerHTML = "";
    Object.entries(tangga).forEach(([s, e]) => drawPath(s, e, '#ffcc00', false));
    Object.entries(ular).forEach(([s, e]) => drawPath(s, e, '#ff4d4d', true));
}

function drawPath(s, e, color, isSnake) {
    const sEl = document.getElementById(`cell-${s}`).getBoundingClientRect();
    const eEl = document.getElementById(`cell-${e}`).getBoundingClientRect();
    const bRect = board.getBoundingClientRect();
    const x1 = sEl.left + 17 - bRect.left;
    const y1 = sEl.top + 17 - bRect.top;
    const x2 = eEl.left + 17 - bRect.left;
    const y2 = eEl.top + 17 - bRect.top;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const cp = (x1 + x2) / 2 + (isSnake ? 50 : -20);
    path.setAttribute("d", `M ${x1} ${y1} Q ${cp} ${(y1+y2)/2} ${x2} ${y2}`);
    path.setAttribute("stroke", color);
    path.setAttribute("fill", "none");
    if(isSnake) path.setAttribute("class", "snake-line");
    else { path.setAttribute("stroke-width", "5"); path.setAttribute("stroke-dasharray", "5,5"); }
    svg.appendChild(path);
}

function updatePlayerPos(p) {
    const cell = document.getElementById(`cell-${p}`);
    const cRect = cell.getBoundingClientRect();
    const bRect = board.getBoundingClientRect();
    const player = document.getElementById('player');
    player.style.left = `${cRect.left - bRect.left - 2}px`;
    player.style.top = `${cRect.top - bRect.top - 15}px`;
}

// FUNGSI JALAN SATU PER SATU
async function walk(steps) {
    isMoving = true;
    for (let i = 0; i < steps; i++) {
        if (posisi >= 100) break;
        posisi++;
        updatePlayerPos(posisi);
        playSound(400 + (i * 50), 'sine', 0.1); // Suara langkah
        await new Promise(r => setTimeout(r, 400)); // Delay per langkah
    }
    
    // Cek Ular atau Tangga
    if (ular[posisi]) {
        status.innerText = "🐍 Sssst! Digigit Ular!";
        await new Promise(r => setTimeout(r, 500));
        posisi = ular[posisi];
        updatePlayerPos(posisi);
        playSound(150, 'sawtooth', 0.5);
    } else if (tangga[posisi]) {
        status.innerText = "🧗 Memanjat Tangga...";
        await new Promise(r => setTimeout(r, 500));
        posisi = tangga[posisi];
        updatePlayerPos(posisi);
        playSound(800, 'triangle', 0.5);
    }
    isMoving = false;
}

function kocokDadu() {
    if (isMoving) return;
    playSound(600, 'square', 0.1);
    const dadu = Math.floor(Math.random() * 6) + 1;
    status.innerText = `Dadu: ${dadu}`;
    if (posisi + dadu <= 100) walk(dadu);
}

window.onload = init;
