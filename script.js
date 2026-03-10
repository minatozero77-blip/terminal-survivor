const board = document.getElementById('board');
const svg = document.getElementById('lines-layer');
const status = document.getElementById('status');
const player = document.getElementById('player');
let posisi = 1;
let isMoving = false;

const ular = { 17: 7, 54: 34, 62: 19, 98: 79, 87: 36, 48: 16 };
const tangga = { 3: 38, 24: 44, 42: 63, 71: 91, 50: 75, 8: 26 };

function playSfx(freq, type, dur = 0.1) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + dur);
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
    setTimeout(() => {
        renderAssets();
        updatePlayerPos(1);
    }, 500);
}

function renderAssets() {
    svg.innerHTML = "";
    Object.entries(tangga).forEach(([s, e]) => drawPath(s, e, false));
    Object.entries(ular).forEach(([s, e]) => drawPath(s, e, true));
}

function drawPath(s, e, isSnake) {
    const sEl = document.getElementById(`cell-${s}`).getBoundingClientRect();
    const eEl = document.getElementById(`cell-${e}`).getBoundingClientRect();
    const bRect = board.getBoundingClientRect();
    const x1 = sEl.left + sEl.width/2 - bRect.left;
    const y1 = sEl.top + sEl.height/2 - bRect.top;
    const x2 = eEl.left + eEl.width/2 - bRect.left;
    const y2 = eEl.top + eEl.height/2 - bRect.top;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const cp = (x1 + x2) / 2 + (isSnake ? 50 : 0);
    path.setAttribute("d", `M ${x1} ${y1} Q ${cp} ${(y1+y2)/2} ${x2} ${y2}`);
    path.setAttribute("class", isSnake ? "snake-line" : "ladder-line");
    path.setAttribute("fill", "none");
    svg.appendChild(path);
}

function updatePlayerPos(p) {
    const cell = document.getElementById(`cell-${p}`);
    const cRect = cell.getBoundingClientRect();
    const bRect = board.getBoundingClientRect();
    player.style.left = `${cRect.left - bRect.left - 4}px`;
    player.style.top = `${cRect.top - bRect.top - 12}px`;
}

async function walk(steps) {
    isMoving = true;
    for (let i = 0; i < steps; i++) {
        if (posisi >= 100) break;
        posisi++;
        updatePlayerPos(posisi);
        playSfx(400 + (i*30), 'sine');
        await new Promise(r => setTimeout(r, 450));
    }
    if (ular[posisi]) {
        status.innerText = "🐍 Ups, Digigit Ular!";
        playSfx(150, 'sawtooth', 0.5);
        document.querySelector('.board-wrapper').classList.add('shake');
        await new Promise(r => setTimeout(r, 600));
        posisi = ular[posisi];
        updatePlayerPos(posisi);
        document.querySelector('.board-wrapper').classList.remove('shake');
    } else if (tangga[posisi]) {
        status.innerText = "🧗 Memanjat Tangga EX!";
        playSfx(800, 'triangle', 0.5);
        await new Promise(r => setTimeout(r, 600));
        posisi = tangga[posisi];
        updatePlayerPos(posisi);
    }
    isMoving = false;
}

function kocokDadu() {
    if (isMoving) return;
    const d = Math.floor(Math.random() * 6) + 1;
    status.innerText = `Dadu: ${d}`;
    if (posisi + d <= 100) walk(d);
}

window.onload = init;
