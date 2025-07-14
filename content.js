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
        const allRows = document.querySelectorAll('.soal-kuesioner-table tbody tr, .aspek-soal');
        for (const row of allRows) {
            let radioToClick = null;
            if (ratingOption === 'sangat-baik') {
                radioToClick = row.querySelector('input[type="radio"][value="1"], input[type="radio"][value="Sangat Baik"]');
            } else if (ratingOption === 'baik') {
                radioToClick = row.querySelector('input[type="radio"][value="2"], input[type="radio"][value="Baik"]');
            } else if (ratingOption === 'acak') {
                const choice = Math.random() < 0.7 ? 'sangat-baik' : 'baik';
                const valueSelector = choice === 'sangat-baik' ? '1' : '2';
                const textSelector = choice === 'sangat-baik' ? '"Sangat Baik"' : '"Baik"';
                radioToClick = row.querySelector(`input[type="radio"][value="${valueSelector}"], input[type="radio"][value=${textSelector}]`);
            }

            if (radioToClick) {
                radioToClick.click();
                await sleep(10); // Jeda singkat untuk stabilitas
            }
        }

        // Mengisi textarea dan pertanyaan spesifik sesuai jenis formulir
        if (isEdomForm) {
            const textareaSaran = document.querySelector('textarea.textarea');
            if (textareaSaran) {
                textareaSaran.value = "Pengajaran sudah sangat baik, materi mudah dipahami, dan dosen sangat membantu. Terima kasih.";
                textareaSaran.dispatchEvent(new Event('input', { bubbles: true }));
            }
            const radioYa = document.querySelector('input[type="radio"][value="Y"]');
            if (radioYa) radioYa.click();
        } else if (isLayananForm) {
            const textareas = document.querySelectorAll('textarea.textarea');
            for (const textarea of textareas) {
                textarea.value = "Secara keseluruhan sudah sangat baik dan memenuhi harapan. Terima kasih.";
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
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
        } else {
             showToast('Tombol Selesai/Simpan tidak ditemukan.', 'error', 4000);
        }
    } catch (error) {
        showToast('Terjadi kesalahan: ' + error.message, 'error', 5000);
        sessionStorage.removeItem('mysikaAutofill'); // Hentikan mode otomatis jika ada error
    }
}

/**
 * Memulai proses pengisian semua kuesioner yang belum dijawab.
 */
function startFillingAll() {
    // Cek apakah kita di halaman daftar kuesioner EDOM
    const isEdomListPage = document.querySelector('.b-tabs .b-table');
    if (!isEdomListPage) {
        showToast('Buka halaman daftar kuesioner EDOM terlebih dahulu!', 'error', 4000);
        return;
    }

    const unansweredButtons = Array.from(document.querySelectorAll('button')).filter(btn => btn.innerText.trim().toLowerCase() === 'jawab');

    if (unansweredButtons.length === 0) {
        showToast('Tidak ada kuesioner yang perlu diisi.', 'info');
        return;
    }

    const rating = document.querySelector('input[name="mysika-rating"]:checked').value;

    // Simpan status ke sessionStorage untuk persistensi antar halaman
    sessionStorage.setItem('mysikaAutofill', JSON.stringify({
        isRunning: true,
        rating: rating
    }));

    showToast(`Memulai pengisian otomatis untuk ${unansweredButtons.length} kuesioner.`, 'info');
    unansweredButtons[0].click(); // Klik tombol "Jawab" yang pertama
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
                <button id="mysika-fill-current-form" class="mysika-action-button">Isi Form Saat Ini</button>
                <button id="mysika-fill-all" class="mysika-action-button special">Isi Semua yg Belum</button>
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
        const isFormPage = document.querySelector('.soal-kuesioner-table, .aspek-soal');
        if (isFormPage) {
            const rating = document.querySelector('input[name="mysika-rating"]:checked').value;
            fillCurrentForm(rating);
            panel.classList.add('mysika-hidden');
            fab.classList.remove('mysika-fab-active');
        } else {
            showToast('Buka halaman pengisian kuesioner terlebih dahulu!', 'error', 4000);
        }
    });

    document.getElementById('mysika-fill-all').addEventListener('click', () => {
        startFillingAll();
        panel.classList.add('mysika-hidden');
        fab.classList.remove('mysika-fab-active');
    });
}

// --- LOGIKA UTAMA SAAT HALAMAN DIMUAT ---
window.addEventListener('load', async () => {
    // Cek apakah mode otomatis sedang berjalan
    const autofillDataString = sessionStorage.getItem('mysikaAutofill');

    if (autofillDataString) {
        const autofillData = JSON.parse(autofillDataString);
        if (autofillData.isRunning) {
            const isFormPage = document.querySelector('.soal-kuesioner-table, .aspek-soal');
            const isListPage = document.querySelector('.b-tabs .b-table');

            if (isFormPage) {
                // Jika kita di halaman formulir, isi formulirnya
                showToast('Mode Otomatis: Mengisi formulir...', 'info', 2000);
                await fillCurrentForm(autofillData.rating);
            } else if (isListPage) {
                // Jika kita kembali ke halaman daftar, cari kuesioner berikutnya
                await new Promise(resolve => setTimeout(resolve, 1000)); // Beri waktu halaman untuk memuat sepenuhnya
                const unansweredButtons = Array.from(document.querySelectorAll('button')).filter(btn => btn.innerText.trim().toLowerCase() === 'jawab');
                
                if (unansweredButtons.length > 0) {
                    showToast(`Mode Otomatis: Melanjutkan ke kuesioner berikutnya... (${unansweredButtons.length} tersisa)`, 'info', 3000);
                    unansweredButtons[0].click();
                } else {
                    // Selesai
                    showToast('Semua kuesioner telah berhasil diisi!', 'success', 5000);
                    sessionStorage.removeItem('mysikaAutofill');
                    createFloatingUI(); // Tampilkan UI lagi setelah selesai
                }
            } else {
                 // Berada di halaman yang tidak terduga, hentikan proses
                 showToast('Mode otomatis dihentikan: Halaman tidak dikenali.', 'error', 5000);
                 sessionStorage.removeItem('mysikaAutofill');
                 createFloatingUI();
            }
            return; // Hentikan eksekusi lebih lanjut agar UI normal tidak muncul selama mode otomatis
        }
    }
    
    // Jika tidak dalam mode otomatis, tampilkan UI seperti biasa.
    createFloatingUI();
});