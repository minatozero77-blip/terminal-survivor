const board = document.getElementById('board');
const status = document.getElementById('status');
let posisiPemain = 1;

// Pembuatan Papan 10x10 secara otomatis
for (let i = 100; i >= 1; i--) {
    let cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = 'cell-' + i;
    cell.innerText = i;
    board.appendChild(cell);
}

function kocokDadu() {
    // Angka acak 1 sampai 6
    const angkaDadu = Math.floor(Math.random() * 6) + 1;
    
    // Hapus tanda pemain di posisi lama
    const cellLama = document.getElementById('cell-' + posisiPemain);
    if (cellLama) cellLama.style.background = '#444';

    posisiPemain += angkaDadu;

    // Cek jika menang
    if (posisiPemain >= 100) {
        posisiPemain = 100;
        status.innerText = "Dadu: " + angkaDadu + ". SELAMAT! Kamu sampai di puncak!";
    } else {
        // Logika Ular & Tangga Sederhana
        if (posisiPemain === 3) { posisiPemain = 20; status.innerText = "Dadu: " + angkaDadu + ". YEAY! Naik tangga ke 20!"; }
        else if (posisiPemain === 15) { posisiPemain = 5; status.innerText = "Dadu: " + angkaDadu + ". UPS! Digigit ular turun ke 5!"; }
        else {
            status.innerText = "Dadu: " + angkaDadu + ". Kamu di posisi " + posisiPemain;
        }
    }

    // Tandai posisi baru pemain (Warna khas HEXA ART)
    const cellBaru = document.getElementById('cell-' + posisiPemain);
    if (cellBaru) cellBaru.style.background = '#00ffc8';
}
