const board = document.getElementById('board');
const svg = document.getElementById('lines-layer');
const status = document.getElementById('status');
let posisiPemain = 1;

const ular = { 17: 7, 54: 34, 62: 19, 98: 79 };
const tangga = { 3: 38, 24: 44, 42: 63, 71: 91 };

function buatPapan() {
    board.innerHTML = "";
    for (let i = 100; i >= 1; i--) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = 'cell-' + i;
        cell.innerText = i;
        board.appendChild(cell);
    }
    // Tunggu papan selesai dibuat baru gambar ular
    setTimeout(gambarUlarDanTangga, 500);
    updatePosisiVisual();
}

function gambarUlarDanTangga() {
    svg.innerHTML = "";
    // Gambar Tangga (Garis Kuning Tebal)
    for (let start in tangga) {
        buatGaris(start, tangga[start], '#ecc94b', 8);
    }
    // Gambar Ular (Garis Merah Meliuk)
    for (let start in ular) {
        buatGaris(start, ular[start], '#f56565', 5);
    }
}

function buatGaris(id1, id2, warna, tebal) {
    const el1 = document.getElementById('cell-' + id1);
    const el2 = document.getElementById('cell-' + id2);
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    const x1 = rect1.left + rect1.width/2 - boardRect.left;
    const y1 = rect1.top + rect1.height/2 - boardRect.top;
    const x2 = rect2.left + rect2.width/2 - boardRect.left;
    const y2 = rect2.top + rect2.height/2 - boardRect.top;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("stroke", warna);
    line.setAttribute("stroke-width", tebal);
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("opacity", "0.6");
    svg.appendChild(line);
}

function updatePosisiVisual() {
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('player'));
    const cellAktif = document.getElementById('cell-' + posisiPemain);
    if (cellAktif) cellAktif.classList.add('player');
}

function kocokDadu() {
    const dadu = Math.floor(Math.random() * 6) + 1;
    let target = posisiPemain + dadu;
    if (target > 100) return;

    posisiPemain = target;
    updatePosisiVisual();

    setTimeout(() => {
        if (ular[posisiPemain]) {
            posisiPemain = ular[posisiPemain];
            status.innerText = "Sssst! Digigit Ular!";
        } else if (tangga[posisiPemain]) {
            posisiPemain = tangga[posisiPemain];
            status.innerText = "Horee! Naik Tangga!";
        } else {
            status.innerText = "Dadu: " + dadu;
        }
        updatePosisiVisual();
    }, 500);
}

buatPapan();
