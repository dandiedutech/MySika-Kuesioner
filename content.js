// ===================================================================================
// MySika Kuesioner Otomatis v3.0
// ===================================================================================

/**
 * Menampilkan notifikasi mengambang (toast) di pojok kanan bawah.
 * @param {string} message - Pesan yang akan ditampilkan.
 * @param {string} type - Tipe notifikasi: 'info', 'success', atau 'error'.
 * @param {number} duration - Durasi dalam milidetik.
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
 * Fungsi untuk mengisi satu form kuesioner yang sedang aktif.
 * @param {string} ratingOption - Pilihan penilaian ('sangat-baik', 'baik', 'acak').
 */
async function fillCurrentForm(ratingOption) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const isEdomForm = document.querySelector('button.button.is-success');
    const isLayananForm = document.querySelector('button.btn-simpan.is-primary');
    const formType = isEdomForm ? 'edom' : 'layanan';

    showToast(`Mengisi kuesioner ${formType}...`, 'info', 4000);

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
                await sleep(10); // Jeda singkat untuk stabilitas
            }
        }

        // Mengisi semua textarea dengan spasi kosong
        const textareas = document.querySelectorAll('textarea.textarea');
        for (const textarea of textareas) {
            textarea.value = 'ㅤ'; // Menggunakan spasi kosong
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // Mengisi pertanyaan "Ya" khusus di EDOM
        if (isEdomForm) {
            const radioYa = document.querySelector('input[type="radio"][value="Y"]');
            if (radioYa) radioYa.click();
        }

        const finishButton = isEdomForm ? isEdomForm : isLayananForm;
        
        if (finishButton) {
            await sleep(250); // Jeda singkat sebelum menyimpan
            finishButton.click();
            await sleep(500); // Tunggu modal konfirmasi muncul

            const activeModal = document.querySelector('div.modal.is-active');
            if (activeModal) {
                const confirmButton = activeModal.querySelector('button.is-success') || Array.from(activeModal.querySelectorAll('button')).find(btn => btn.innerText.trim() === 'Ya, selesai');
                if (confirmButton) {
                    showToast('Menyimpan formulir...', 'success', 2000);
                    confirmButton.click();
                }
            }
        }
        showToast('Pengisian selesai!', 'success', 3000);
    } catch (error) {
        showToast('Terjadi kesalahan: ' + error.message, 'error', 5000);
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
                <button id="mysika-fill-current-form" class="mysika-action-button special">Isi Form Saat Ini</button>
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

    document.getElementById('mysika-fill-current-form').addEventListener('click', () => {
        const isFormPage = document.querySelector('.soal-kuesioner-table');
        if (isFormPage) {
            const rating = document.querySelector('input[name="mysika-rating"]:checked').value;
            fillCurrentForm(rating);
            panel.classList.add('mysika-hidden');
            fab.classList.remove('mysika-fab-active');
        } else {
            showToast('Buka halaman pengisian kuesioner terlebih dahulu!', 'error', 4000);
        }
    });
}

// --- LOGIKA UTAMA SAAT HALAMAN DIMUAT ---
window.addEventListener('load', () => {
    createFloatingUI();
});
