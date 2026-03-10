const board = document.getElementById('board');
const status = document.getElementById('status');
let posisiPemain = 1;

// Database Ular & Tangga (Bisa kamu tambah sendiri nanti)
const ular = { 17: 7, 54: 34, 62: 19, 98: 79, 87: 36, 48: 16 };
const tangga = { 3: 38, 24: 44, 42: 63, 71: 91, 50: 75, 8: 26 };

// Fungsi Suara Modern (Synth Browser)
function mainkanSuara(frekuensi, tipe) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContext();
        
        // Memaksa audio aktif setelah user klik
        if (context.state === 'suspended') {
            context.resume();
        }

        const osc = context.createOscillator();
        const gain = context.createGain();
        
        osc.type = tipe; // 'sine', 'square', 'sawtooth', 'triangle'
        osc.frequency.setValueAtTime(frekuensi, context.currentTime);
        
        gain.gain.setValueAtTime(0.1, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.4);
        
        osc.connect(gain);
        gain.connect(context.destination);
        
        osc.start();
        osc.stop(context.currentTime + 0.4);
    } catch (e) {
        console.log("Audio belum diizinkan browser");
    }
}

function buatPapan() {
    board.innerHTML = "";
    // Membuat papan 100 ke 1
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
    if (cellAktif) {
        cellAktif.classList.add('player');
        // Scroll otomatis ke posisi pemain agar tidak hilang di layar HP
        cellAktif.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function kocokDadu() {
    // Suara klik dadu (frekuensi menengah)
    mainkanSuara(523.25, 'square'); 

    const dadu = Math.floor(Math.random() * 6) + 1;
    let targetBaru = posisiPemain + dadu;

    if (targetBaru > 100) {
        status.innerText = `🎲 Dadu: ${dadu}. Terlalu jauh untuk finish!`;
        return;
    }

    posisiPemain = targetBaru;
    updatePosisiVisual();

    // Jeda sedikit agar mata bisa mengikuti gerakan
    setTimeout(() => {
        if (ular[posisiPemain]) {
            // Efek Guncang
            board.classList.add('shake');
            mainkanSuara(150, 'sawtooth'); // Suara ular (bass rendah)
            setTimeout(() => board.classList.remove('shake'), 500);
            
            status.innerText = `🐍 OUCH! Digigit ular, turun ke ${ular[posisiPemain]}!`;
            posisiPemain = ular[posisiPemain];
        } else if (tangga[posisiPemain]) {
            mainkanSuara(880, 'sine'); // Suara tangga (nada tinggi ceria)
            status.innerText = `🚀 MANTAP! Naik tangga ke ${tangga[posisiPemain]}!`;
            posisiPemain = tangga[posisiPemain];
        } else if (posisiPemain === 100) {
            status.innerText = "🎊 JUARA! Kamu menang, Rif!";
            // Suara kemenangan berkali-kali
            let winInterval = setInterval(() => mainkanSuara(Math.random() * 600 + 400, 'sine'), 150);
            setTimeout(() => {
                clearInterval(winInterval);
                alert("Selamat! Kamu pemenangnya!");
                posisiPemain = 1; // Reset game
                updatePosisiVisual();
            }, 2000);
        } else {
            status.innerText = `🎲 Dadu: ${dadu}. Kamu sekarang di posisi ${posisiPemain}`;
        }
        updatePosisiVisual();
    }, 600);
}

// Jalankan pembuatan papan saat pertama kali buka
buatPapan();
