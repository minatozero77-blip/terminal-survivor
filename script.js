const board = document.getElementById('board');
const status = document.getElementById('status');
let posisiPemain = 1;

const ular = { 17: 7, 54: 34, 62: 19, 98: 79 };
const tangga = { 3: 38, 24: 44, 42: 63, 71: 91 };

// Fungsi Suara Gratis (Browser Synth)
function mainkanSuara(frekuensi, tipe) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = tipe;
    osc.frequency.setValueAtTime(frekuensi, context.currentTime);
    gain.gain.setValueAtTime(0.1, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + 0.5);
}

function buatPapan() {
    board.innerHTML = "";
    for (let i = 100; i >= 1; i--) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = 'cell-' + i;
        cell.innerText = i;
        if (ular[i]) cell.classList.add('snake');
        if (tangga[i]) cell.classList.add('ladder');
        board.appendChild(cell);
    }
    updatePosisiVisual();
}

function updatePosisiVisual() {
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('player'));
    const cellAktif = document.getElementById('cell-' + posisiPemain);
    if (cellAktif) cellAktif.classList.add('player');
}

function kocokDadu() {
    mainkanSuara(440, 'square'); // Suara klik dadu
    const dadu = Math.floor(Math.random() * 6) + 1;
    let targetBaru = posisiPemain + dadu;

    if (targetBaru > 100) {
        status.innerText = `🎲 Dadu: ${dadu}. Terlalu jauh!`;
        return;
    }

    posisiPemain = targetBaru;
    updatePosisiVisual();

    setTimeout(() => {
        if (ular[posisiPemain]) {
            board.classList.add('shake');
            mainkanSuara(110, 'sawtooth'); // Suara ular (berat)
            setTimeout(() => board.classList.remove('shake'), 500);
            status.innerText = `🐍 OUCH! Turun ke ${ular[posisiPemain]}!`;
            posisiPemain = ular[posisiPemain];
        } else if (tangga[posisiPemain]) {
            mainkanSuara(880, 'sine'); // Suara tangga (ceria)
            status.innerText = `🚀 HEBAT! Naik ke ${tangga[posisiPemain]}!`;
            posisiPemain = tangga[posisiPemain];
        } else if (posisiPemain === 100) {
            status.innerText = "🎊 MENANG! KEMBANG API!";
            setInterval(() => mainkanSuara(Math.random() * 500 + 400, 'sine'), 100);
            alert("SELAMAT! Kamu adalah juara HEXA ART!");
        } else {
            status.innerText = `🎲 Dadu: ${dadu}. Kamu di posisi ${posisiPemain}`;
        }
        updatePosisiVisual();
    }, 500);
}

buatPapan();
