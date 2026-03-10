const board = document.getElementById('board');
const svg = document.getElementById('lines-layer');
const status = document.getElementById('status');
let posisi = 1;

const ular = { 17: 7, 54: 34, 62: 19, 98: 79 };
const tangga = { 3: 38, 24: 44, 42: 63, 71: 91 };

function init() {
    board.innerHTML = "";
    for (let i = 100; i >= 1; i--) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${i}`;
        cell.innerText = i;
        board.appendChild(cell);
    }
    
    // Tambahkan Pion Chibi
    const player = document.createElement('div');
    player.id = 'player';
    player.className = 'player';
    player.innerHTML = '<div class="chibi-char"></div>';
    document.body.appendChild(player);
    
    setTimeout(renderLines, 500);
    movePlayer(1);
}

function renderLines() {
    svg.innerHTML = "";
    const bRect = board.getBoundingClientRect();
    
    // Render Tangga
    Object.entries(tangga).forEach(([s, e]) => drawPath(s, e, '#ffcc00', 6, false));
    // Render Ular Beranimasi
    Object.entries(ular).forEach(([s, e]) => drawPath(s, e, '#ff4d4d', 4, true));
}

function drawPath(s, e, color, width, isSnake) {
    const startEl = document.getElementById(`cell-${s}`).getBoundingClientRect();
    const endEl = document.getElementById(`cell-${e}`).getBoundingClientRect();
    const bRect = board.getBoundingClientRect();

    const x1 = startEl.left + 25 - bRect.left;
    const y1 = startEl.top + 25 - bRect.top;
    const x2 = endEl.left + 25 - bRect.left;
    const y2 = endEl.top + 25 - bRect.top;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // Membuat garis melengkung (Bezier Curve)
    const cx = (x1 + x2) / 2 + (isSnake ? 30 : 0);
    const d = `M ${x1} ${y1} Q ${cx} ${(y1 + y2) / 2} ${x2} ${y2}`;
    
    path.setAttribute("d", d);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", width);
    path.setAttribute("fill", "none");
    if (isSnake) path.setAttribute("class", "snake-line");
    svg.appendChild(path);
}

function movePlayer(target) {
    const cell = document.getElementById(`cell-${target}`);
    const rect = cell.getBoundingClientRect();
    const player = document.getElementById('player');
    
    player.style.position = 'absolute';
    player.style.left = `${rect.left + 2}px`;
    player.style.top = `${rect.top - 15}px`;
}

function kocokDadu() {
    const dadu = Math.floor(Math.random() * 6) + 1;
    let newPos = posisi + dadu;
    
    if (newPos > 100) return;
    
    posisikan(newPos, () => {
        if (ular[newPos]) {
            setTimeout(() => posisikan(ular[newPos], () => status.innerText = "🐍 Digigit Ular!"), 500);
        } else if (tangga[newPos]) {
            setTimeout(() => posisikan(tangga[newPos], () => status.innerText = "🚀 Naik Tangga!"), 500);
        }
    });
}

function posisikan(p, callback) {
    posisi = p;
    movePlayer(p);
    status.innerText = `Posisi: ${p}`;
    if (callback) callback();
}

init();
