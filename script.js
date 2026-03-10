const board = document.getElementById('board');
const svg = document.getElementById('lines-layer');
const status = document.getElementById('status');
let posisi = 1;

const ular = { 17: 7, 54: 34, 62: 19, 98: 79 };
const tangga = { 3: 38, 24: 44, 42: 63, 71: 91 };

function init() {
    board.innerHTML = "";
    // Bikin papan dulu
    for (let i = 100; i >= 1; i--) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${i}`;
        cell.innerText = i;
        board.appendChild(cell);
    }
    
    // Siapkan wadah player jika belum ada
    if(!document.getElementById('player')) {
        const p = document.createElement('div');
        p.id = 'player';
        document.querySelector('.board-wrapper').appendChild(p);
    }

    // Gambar ular & tangga setelah papan siap
    setTimeout(() => {
        renderLines();
        updatePlayerPos(1);
    }, 300);
}

function renderLines() {
    svg.innerHTML = "";
    const bRect = board.getBoundingClientRect();
    
    // Gambar Tangga
    Object.entries(tangga).forEach(([s, e]) => drawPath(s, e, '#ffcc00', false));
    // Gambar Ular
    Object.entries(ular).forEach(([s, e]) => drawPath(s, e, '#ff4d4d', true));
}

function drawPath(s, e, color, isSnake) {
    const sEl = document.getElementById(`cell-${s}`).getBoundingClientRect();
    const eEl = document.getElementById(`cell-${e}`).getBoundingClientRect();
    const bRect = board.getBoundingClientRect();

    const x1 = sEl.left + sEl.width/2 - bRect.left;
    const y1 = sEl.top + sEl.height/2 - bRect.top;
    const x2 = eEl.left + eEl.width/2 - bRect.left;
    const y2 = eEl.top + eEl.height/2 - bRect.top;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const cp = (x1 + x2) / 2 + (isSnake ? 40 : 0); // Efek melengkung
    const d = `M ${x1} ${y1} Q ${cp} ${(y1+y2)/2} ${x2} ${y2}`;
    
    path.setAttribute("d", d);
    path.setAttribute("stroke", color);
    if(isSnake) path.setAttribute("class", "snake-line");
    else {
        path.setAttribute("stroke-width", "6");
        path.setAttribute("stroke-dasharray", "2,2");
    }
    path.setAttribute("fill", "none");
    svg.appendChild(path);
}

function updatePlayerPos(p) {
    const cell = document.getElementById(`cell-${p}`);
    const cRect = cell.getBoundingClientRect();
    const bRect = board.getBoundingClientRect();
    const player = document.getElementById('player');
    
    player.style.left = `${cRect.left - bRect.left - 2}px`;
    player.style.top = `${cRect.top - bRect.top - 10}px`;
}

function kocokDadu() {
    const dadu = Math.floor(Math.random() * 6) + 1;
    let target = posisi + dadu;
    if (target > 100) return;

    posisi = target;
    updatePlayerPos(posisi);
    status.innerText = `Dadu: ${dadu}`;

    setTimeout(() => {
        if (ular[posisi]) {
            posisi = ular[posisi];
            updatePlayerPos(posisi);
            status.innerText = "🐍 Ups, Digigit Ular!";
        } else if (tangga[posisi]) {
            posisi = tangga[posisi];
            updatePlayerPos(posisi);
            status.innerText = "🚀 Yeay, Naik Tangga!";
        }
    }, 600);
}

window.onload = init;
