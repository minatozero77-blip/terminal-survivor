const board = document.getElementById('board');
const svg = document.getElementById('lines-layer');
const status = document.getElementById('status');
const player = document.getElementById('player');
const ai1 = document.getElementById('ai-player');
const ai2 = document.getElementById('ai-player-2');
const rollBtn = document.getElementById('roll-btn');

let pos = { p: 1, ai1: 1, ai2: 1 };
let isMoving = false;
let audioCtx = null;

const ular = { 17: 7, 54: 34, 62: 19, 98: 79, 87: 36, 48: 16 };
const tangga = { 3: 38, 24: 44, 42: 63, 71: 91, 50: 75, 8: 26 };

function playSfx(freq, type, dur = 0.1) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, audioCtx.currentTime);
    g.gain.setValueAtTime(0.1, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
}

function init() {
    board.innerHTML = "";
    for (let i = 100; i >= 1; i--) {
        const cell = document.createElement('div');
        cell.className = 'cell'; cell.id = `cell-${i}`;
        cell.innerText = i; board.appendChild(cell);
    }
    setTimeout(() => {
        renderAssets();
        updatePos(player, 1, 'p');
        updatePos(ai1, 1, 'ai1');
        updatePos(ai2, 1, 'ai2');
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

function updatePos(el, p, type) {
    const cell = document.getElementById(`cell-${p}`);
    if(!cell) return;
    const cRect = cell.getBoundingClientRect();
    const bRect = board.getBoundingClientRect();
    let offsetHor = (type === 'p') ? -7 : (type === 'ai2' ? 7 : 0);
    el.style.left = `${cRect.left - bRect.left + offsetHor}px`;
    el.style.top = `${cRect.top - bRect.top - 8}px`;
}

async function walk(type, steps) {
    isMoving = true;
    rollBtn.disabled = true;
    const el = type === 'p' ? player : (type === 'ai1' ? ai1 : ai2);
    const name = type === 'p' ? 'Najwa' : (type === 'ai1' ? 'AI 1' : 'AI 2');

    for (let i = 0; i < steps; i++) {
        if (pos[type] >= 100) break;
        pos[type]++;
        updatePos(el, pos[type], type);
        playSfx(type === 'p' ? 500 : 350, 'sine');
        await new Promise(r => setTimeout(r, 450));
    }

    let currentPos = pos[type];
    if (ular[currentPos]) {
        status.innerText = `🐍 ${name} kena Ular!`;
        playSfx(150, 'sawtooth', 0.5);
        document.querySelector('.board-wrapper').classList.add('shake');
        await new Promise(r => setTimeout(r, 600));
        pos[type] = ular[currentPos];
        updatePos(el, pos[type], type);
        document.querySelector('.board-wrapper').classList.remove('shake');
    } else if (tangga[currentPos]) {
        status.innerText = `🧗 ${name} naik Tangga!`;
        playSfx(800, 'triangle', 0.5);
        await new Promise(r => setTimeout(r, 600));
        pos[type] = tangga[currentPos];
        updatePos(el, pos[type], type);
    }

    if (pos[type] >= 100) {
        status.innerText = `🏆 ${name.toUpperCase()} MENANG!`;
        return;
    }

    if (type === 'p') {
        status.innerText = "🤖 Giliran AI 1...";
        setTimeout(() => aiTurn('ai1'), 1200);
    } else if (type === 'ai1') {
        status.innerText = "👾 Giliran AI 2...";
        setTimeout(() => aiTurn('ai2'), 1200);
    } else {
        status.innerText = "🎲 Giliranmu, Najwa!";
        isMoving = false;
        rollBtn.disabled = false;
    }
}

function kocokDadu() {
    if (isMoving) return;
    playSfx(440, 'square', 0.05); 
    const d = Math.floor(Math.random() * 6) + 1;
    status.innerText = `Najwa kocok: ${d}`;
    walk('p', d);
}

function aiTurn(type) {
    const d = Math.floor(Math.random() * 6) + 1;
    status.innerText = `${type === 'ai1' ? 'AI 1' : 'AI 2'} kocok: ${d}`;
    walk(type, d);
}

window.onload = init;
