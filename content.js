// ===================================================================================
// MySika Kuesioner Otomatis v3.1 - Perbaikan Bug & Peningkatan Stabilitas
// ===================================================================================

/**
 * Menampilkan notifikasi mengambang (toast) di pojok kanan bawah.
 * @param {string} message - Pesan yang akan ditampilkan.
 * @param {string} type - Tipe notifikasi: 'info', 'success', atau 'error'.
 * @param {number} duration - Durasi dalam milidetik. 0 berarti tidak hilang otomatis.
 */
function showToast(message, type = 'info', duration = 3000) {
    const existingToast = document.getElementById('mysika-toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'mysika-toast';
    toast.className = `mysika-toast mysika-toast-${type}`;
    toast.innerHTML = `
        <div class="mysika-toast-icon"></div>
        <div class="mysika-toast-message">${message}</div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('mysika-toast-visible'), 10);

    if (duration > 0) {
        setTimeout(() => {
            toast.classList.remove('mysika-toast-visible');
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    }
}

/**
 * Menunggu sebuah elemen muncul di halaman sebelum menjalankan fungsi callback.
 * @param {string} selector - Selector CSS dari elemen yang ditunggu.
 * @param {function} callback - Fungsi yang akan dijalankan setelah elemen ditemukan.
 * @param {number} timeout - Waktu maksimal menunggu dalam milidetik.
 */
function waitForElement(selector, callback, timeout = 10000) {
    const intervalTime = 100;
    let timeWaited = 0;

    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval);
            callback();
        } else {
            timeWaited += intervalTime;
            if (timeWaited >= timeout) {
                clearInterval(interval);
                showToast('Gagal memuat elemen halaman. Coba lagi.', 'error', 5000);
                sessionStorage.clear(); // Hentikan semua proses
            }
        }
    }, intervalTime);
}


/**
 * Fungsi untuk mengisi satu form kuesioner dengan cepat (tanpa scrolling).
 * @param {string} ratingOption - Pilihan penilaian ('sangat-baik', 'baik', 'acak').
 */
async function fillSingleForm(ratingOption) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const formType = document.querySelector('button.btn-simpan.is-primary') ? 'layanan' : 'edom';
    
    showToast(`Mengisi kuesioner...`, 'info', 0);

    try {
        const allRows = document.querySelectorAll('.soal-kuesioner-table tbody tr');
        for (const row of allRows) {
            let radioToClick = null;
            if (ratingOption === 'sangat-baik') {
                radioToClick = row.querySelector('td:nth-child(3) input[type="radio"][value="1"]');
            } else if (ratingOption === 'baik') {
                radioToClick = row.querySelector('td:nth-child(4) input[type="radio"][value="2"]');
            } else if (ratingOption === 'acak') {
                const choice = Math.random() < 0.7 ? 'sangat-baik' : 'baik';
                const selector = choice === 'sangat-baik' ? 'td:nth-child(3) input[type="radio"][value="1"]' : 'td:nth-child(4) input[type="radio"][value="2"]';
                radioToClick = row.querySelector(selector);
            }

            if (radioToClick) {
                radioToClick.click();
                await sleep(10); // Jeda sangat singkat untuk stabilitas
            }
        }

        // Mengisi semua textarea dengan spasi kosong
        const textareas = document.querySelectorAll('textarea.textarea');
        for (const textarea of textareas) {
            textarea.value = 'ㅤ'; // Menggunakan spasi kosong
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // Mengisi pertanyaan "Ya" khusus di EDOM
        if (formType === 'edom') {
            const radioYa = document.querySelector('input[type="radio"][value="Y"]');
            if (radioYa) radioYa.click();
        }

        const finishButton = document.querySelector(formType === 'edom' ? 'button.button.is-success' : 'button.btn-simpan.is-primary');
        
        if (finishButton) {
            await sleep(250); // Jeda singkat sebelum menyimpan
            finishButton.click();
            await sleep(500); // Tunggu modal konfirmasi muncul

            const activeModal = document.querySelector('div.modal.is-active');
            if (activeModal) {
                const confirmButton = activeModal.querySelector('button.is-success') || Array.from(activeModal.querySelectorAll('button')).find(btn => btn.innerText.trim() === 'Ya, selesai');
                if (confirmButton) {
                    showToast('Menyimpan dan kembali...', 'info', 0);
                    confirmButton.click();
                    // Set flag untuk menandakan kita akan kembali ke halaman daftar
                    setTimeout(() => {
                        sessionStorage.setItem('mysika_return_from_fill', 'true');
                        window.location.href = '/kuesioner';
                    }, 500);
                }
            }
        }
    } catch (error) {
        showToast('Terjadi kesalahan: ' + error.message, 'error', 5000);
        sessionStorage.removeItem('mysika_process_all_edom');
    }
}

/**
 * Memulai dan melanjutkan proses pengisian semua EDOM.
 */
async function processAllEdoms() {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const ratingOption = sessionStorage.getItem('mysika_rating_option');
    if (!ratingOption) {
        showToast('Opsi penilaian tidak ditemukan!', 'error');
        return;
    }

    await sleep(500); // Beri waktu halaman untuk memuat

    const tableRows = document.querySelectorAll('.b-table .table tbody tr');
    let nextButton = null;

    for (const row of tableRows) {
        const statusIcon = row.querySelector('.mdi-minus-circle'); // Icon "belum selesai"
        if (statusIcon) {
            const buttonElement = row.querySelector('button span:last-child');
            if (buttonElement && buttonElement.innerText.trim() === 'Jawab') {
                nextButton = buttonElement.closest('button');
                break;
            }
        }
    }

    if (nextButton) {
        const matkul = nextButton.closest('tr').querySelector('td[data-label="Mata Kuliah"]').innerText;
        showToast(`Memproses: ${matkul.trim()}...`, 'info', 2000);
        await sleep(1000);
        nextButton.click();
    } else {
        showToast('Selesai! Semua kuesioner EDOM telah diisi.', 'success', 5000);
        sessionStorage.removeItem('mysika_process_all_edom');
        sessionStorage.removeItem('mysika_rating_option');
    }
}

/**
 * Membuat UI tombol mengambang.
 */
function createFloatingUI() {
    const fab = document.createElement('div');
    fab.id = 'mysika-fab';
    fab.innerHTML = `<img src="${chrome.runtime.getURL("images/icon48.png")}" alt="MySika">`;
    
    const panel = document.createElement('div');
    panel.id = 'mysika-panel';
    panel.classList.add('mysika-hidden');

    panel.innerHTML = `
        <div class="mysika-header">
            <div class="mysika-title">MySika Kuesioner</div>
            <div class="mysika-subtitle">Otomatisasi Pengisian</div>
        </div>
        <div class="mysika-content">
            <div class="mysika-options-label">1. Pilih Opsi Penilaian</div>
            <div class="mysika-radio-group">
                <div class="mysika-radio-option">
                    <input type="radio" id="mysika-sangat-baik" name="mysika-rating" value="sangat-baik" checked>
                    <label for="mysika-sangat-baik">Sangat Baik</label>
                </div>
                <div class="mysika-radio-option">
                    <input type="radio" id="mysika-baik" name="mysika-rating" value="baik">
                    <label for="mysika-baik">Baik</label>
                </div>
                <div class="mysika-radio-option">
                    <input type="radio" id="mysika-acak" name="mysika-rating" value="acak">
                    <label for="mysika-acak">Acak</label>
                </div>
            </div>
            <div class="mysika-options-label">2. Pilih Aksi</div>
            <div class="mysika-button-group">
                <button id="mysika-fill-all-edom" class="mysika-action-button special">Isi Semua EDOM Sekaligus</button>
                <button id="mysika-fill-layanan" class="mysika-action-button">Isi Form Layanan Saat Ini</button>
            </div>
        </div>
        <div class="mysika-footer">
            Dibuat oleh <a href="https://www.instagram.com/dandisubhani_" target="_blank">@dandisubhani_</a>
        </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    fab.addEventListener('click', () => {
        panel.classList.toggle('mysika-hidden');
        fab.classList.toggle('mysika-fab-active');
    });

    document.getElementById('mysika-fill-all-edom').addEventListener('click', () => {
        const uncompleted = document.querySelectorAll('.b-table .table tbody tr .mdi-minus-circle');
        if (uncompleted.length === 0) {
            showToast('Semua kuesioner EDOM sudah terisi.', 'success');
            return;
        }

        const rating = document.querySelector('input[name="mysika-rating"]:checked').value;
        sessionStorage.setItem('mysika_process_all_edom', 'true');
        sessionStorage.setItem('mysika_rating_option', rating);
        panel.classList.add('mysika-hidden');
        fab.classList.remove('mysika-fab-active');
        processAllEdoms();
    });

    document.getElementById('mysika-fill-layanan').addEventListener('click', () => {
        const isLayananForm = document.querySelector('.soal-kuesioner-table') && document.querySelector('button.btn-simpan.is-primary');
        if (isLayananForm) {
            const rating = document.querySelector('input[name="mysika-rating"]:checked').value;
            fillSingleForm(rating);
        } else {
            showToast('Buka tab "Layanan" lalu isi formnya terlebih dahulu.', 'error', 4000);
        }
    });
}

// --- LOGIKA UTAMA SAAT HALAMAN DIMUAT ---
window.addEventListener('load', () => {
    createFloatingUI();

    const isProcessingAll = sessionStorage.getItem('mysika_process_all_edom') === 'true';
    const cameFromFill = sessionStorage.getItem('mysika_return_from_fill') === 'true';
    const ratingOption = sessionStorage.getItem('mysika_rating_option');

    if (isProcessingAll) {
        // Jika kita berada di halaman pengisian
        if (window.location.href.includes('makul_kuesioner_proses_pembelajaran')) {
            waitForElement('.soal-kuesioner-table', () => {
                fillSingleForm(ratingOption);
            });
        }
        // Jika kita baru saja kembali ke halaman daftar
        else if (cameFromFill) {
            sessionStorage.removeItem('mysika_return_from_fill');
            waitForElement('.b-table', () => {
                processAllEdoms();
            });
        }
    }
});
