const board = document.getElementById('board');
const status = document.getElementById('status');
let posisiPemain = 1;

// Data Ular dan Tangga (Angka Awal: Angka Tujuan)
const ular = { 17: 7, 54: 34, 62: 19, 98: 79 };
const tangga = { 3: 38, 24: 44, 42: 63, 71: 91 };

function buatPapan() {
    board.innerHTML = ""; // Bersihkan papan
    for (let i = 100; i >= 1; i--) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = 'cell-' + i;
        cell.innerText = i;
        
        // Tandai sel khusus visual
        if (ular[i]) cell.classList.add('snake');
        if (tangga[i]) cell.classList.add('ladder');
        
        board.appendChild(cell);
    }
    updatePosisiVisual();
}

function updatePosisiVisual() {
    // Reset semua warna sel
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('player'));
    
    // Beri warna pada posisi sekarang
    const cellAktif = document.getElementById('cell-' + posisiPemain);
    if (cellAktif) cellAktif.classList.add('player');
}

function kocokDadu() {
    const dadu = Math.floor(Math.random() * 6) + 1;
    let targetBaru = posisiPemain + dadu;

    if (targetBaru > 100) {
        status.innerText = `Dadu: ${dadu}. Lewat dari 100!`;
        return;
    }

    posisiPemain = targetBaru;
    updatePosisiVisual();

    // Cek Ular/Tangga setelah jeda singkat (efek animasi)
    setTimeout(() => {
        if (ular[posisiPemain]) {
            status.innerText = `Dadu: ${dadu}. OUCH! Digigit ular ke ${ular[posisiPemain]}`;
            posisiPemain = ular[posisiPemain];
        } else if (tangga[posisiPemain]) {
            status.innerText = `Dadu: ${dadu}. HEBAT! Naik tangga ke ${tangga[posisiPemain]}`;
            posisiPemain = tangga[posisiPemain];
        } else if (posisiPemain === 100) {
            status.innerText = "SELAMAT! Kamu Menang!";
        } else {
            status.innerText = `Dadu: ${dadu}. Kamu di posisi ${posisiPemain}`;
        }
        updatePosisiVisual();
    }, 400);
}

buatPapan();
