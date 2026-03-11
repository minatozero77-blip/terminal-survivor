const board = document.getElementById('board');
const svg = document.getElementById('lines-layer');
const status = document.getElementById('status');
const player = document.getElementById('player');
const aiPlayer = document.getElementById('ai-player');
const rollBtn = document.getElementById('roll-btn');

let posPlayer = 1;
let posAI = 1;
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
        cell.className = 'cell'; cell.id = `cell-${i}`;
        cell.innerText = i; board.appendChild(cell);
    }
    setTimeout(() => {
        renderAssets();
        updatePos(player, 1);
        updatePos(aiPlayer, 1);
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

function updatePos(el, p) {
    const cell = document.getElementById(`cell-${p}`);
    const cRect = cell.getBoundingClientRect();
    const bRect = board.getBoundingClientRect();
    // Jika pion player, taruh agak ke kiri, jika AI agak ke kanan biar gak tumpang tindih
    const offset = (el.id === 'player') ? -5 : 5;
    el.style.left = `${cRect.left - bRect.left + offset}px`;
    el.style.top = `${cRect.top - bRect.top - 12}px`;
}

async function walk(isAI, steps) {
    isMoving = true;
    rollBtn.disabled = true;
    
    for (let i = 0; i < steps; i++) {
        if (isAI) {
            if (posAI >= 100) break;
            posAI++; updatePos(aiPlayer, posAI);
        } else {
            if (posPlayer >= 100) break;
            posPlayer++; updatePos(player, posPlayer);
        }
        playSfx(isAI ? 300 + (i*20) : 500 + (i*20), 'sine');
        await new Promise(r => setTimeout(r, 400));
    }
    
    let currentPos = isAI ? posAI : posPlayer;
    
    if (ular[currentPos]) {
        status.innerText = isAI ? "🤖 AI Kena Ular!" : "🐍 Kamu Kena Ular!";
        playSfx(150, 'sawtooth', 0.5);
        await new Promise(r => setTimeout(r, 600));
        if (isAI) { posAI = ular[currentPos]; updatePos(aiPlayer, posAI); }
        else { posPlayer = ular[currentPos]; updatePos(player, posPlayer); }
    } else if (tangga[currentPos]) {
        status.innerText = isAI ? "🤖 AI Naik Tangga!" : "🧗 Kamu Naik Tangga!";
        playSfx(800, 'triangle', 0.5);
        await new Promise(r => setTimeout(r, 600));
        if (isAI) { posAI = tangga[currentPos]; updatePos(aiPlayer, posAI); }
        else { posPlayer = tangga[currentPos]; updatePos(player, posPlayer); }
    }

    if (posPlayer >= 100) {
        status.innerText = "🏆 SELAMAT ARIF MENANG!";
        return;
    } else if (posAI >= 100) {
        status.innerText = "💀 AI MENANG! COBA LAGI.";
        return;
    }

    isMoving = false;
    if (!isAI) {
        status.innerText = "🤖 Giliran AI berpikir...";
        setTimeout(aiTurn, 1000);
    } else {
        status.innerText = "🎲 Giliranmu, Rif!";
        rollBtn.disabled = false;
    }
}

function kocokDadu() {
    if (isMoving) return;
    const d = Math.floor(Math.random() * 6) + 1;
    status.innerText = `Kamu kocok: ${d}`;
    walk(false, d);
}

function aiTurn() {
    const d = Math.floor(Math.random() * 6) + 1;
    status.innerText = `AI kocok: ${d}`;
    walk(true, d);
}

window.onload = init;
