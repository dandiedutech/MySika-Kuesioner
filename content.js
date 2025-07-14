// ===================================================================================
// MySika Kuesioner Otomatis v3.1
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
    const formType = isEdomForm ? 'EDOM' : 'Layanan';

    // Tidak menampilkan toast di sini agar tidak tumpang tindih dengan toast dari fungsi sekuensial
    // showToast(`Mengisi kuesioner ${formType}...`, 'info', 4000);

    try {
        const allRows = document.querySelectorAll('.soal-kuesioner-table tbody tr');
        for (const row of allRows) {
            let radioToClick = null;
            if (ratingOption === 'sangat-baik') {
                radioToClick = row.querySelector('td:nth-child(3) input[type="radio"]'); // Ambil radio pertama yang bisa diklik
            } else if (ratingOption === 'baik') {
                radioToClick = row.querySelector('td:nth-child(4) input[type="radio"]'); // Ambil radio kedua
            } else if (ratingOption === 'acak') {
                const choice = Math.random() < 0.7 ? 'sangat-baik' : 'baik';
                const selector = choice === 'sangat-baik' ? 'td:nth-child(3) input[type="radio"]' : 'td:nth-child(4) input[type="radio"]';
                radioToClick = row.querySelector(selector);
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
                    // showToast('Menyimpan formulir...', 'success', 2000); // Dihilangkan agar tidak berlebihan
                    confirmButton.click();
                }
            }
        }
        // showToast('Pengisian selesai!', 'success', 3000); // Dihilangkan
    } catch (error) {
        showToast('Terjadi kesalahan: ' + error.message, 'error', 5000);
    }
}


/**
 * Fungsi BARU untuk menemukan dan mengisi semua kuesioner EDOM secara berurutan.
 * @param {string} ratingOption - Pilihan penilaian.
 */
async function fillAllEdomSequentially(ratingOption) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const jawabButtons = Array.from(document.querySelectorAll('td[data-label="Aksi"] button')).filter(btn => btn.innerText.trim().includes('Jawab'));

    if (jawabButtons.length === 0) {
        showToast('Tidak ada kuesioner EDOM yang perlu diisi.', 'info', 4000);
        return;
    }

    showToast(`Ditemukan ${jawabButtons.length} kuesioner EDOM. Memulai pengisian otomatis...`, 'info', 5000);
    await sleep(2000);

    for (let i = 0; i < jawabButtons.length; i++) {
        // Selalu cari ulang tombol "Jawab" di setiap iterasi karena halaman di-reload
        const currentJawabButtons = Array.from(document.querySelectorAll('td[data-label="Aksi"] button')).filter(btn => btn.innerText.trim().includes('Jawab'));
        const buttonToClick = currentJawabButtons[0]; // Ambil tombol "Jawab" pertama yang tersisa

        if (!buttonToClick) {
            showToast('Tidak dapat menemukan tombol "Jawab" berikutnya.', 'error', 4000);
            break; 
        }

        const matkul = buttonToClick.closest('tr').querySelector('td[data-label="Mata Kuliah"]').innerText;
        showToast(`(${i + 1}/${jawabButtons.length}) Mengisi: ${matkul}`, 'info', 4000);

        buttonToClick.click();
        await sleep(2500); // Tunggu halaman form kuesioner dimuat

        await fillCurrentForm(ratingOption);
        await sleep(3000); // Tunggu halaman kembali ke daftar kuesioner
    }

    showToast('Semua kuesioner EDOM telah selesai diisi!', 'success', 5000);
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
            <div class="mysika-subtitle">Otomatisasi Pengisian v3.1</div>
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
                <button id="mysika-fill-edom" class="mysika-action-button special">Isi Semua EDOM</button>
                <button id="mysika-fill-layanan" class="mysika-action-button">Isi Form Layanan</button>
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

    const handleFill = async (formType) => {
        const rating = document.querySelector('input[name="mysika-rating"]:checked').value;
        const isEdomListPage = document.querySelector('td[data-label="Aksi"] button');
        const isEdomFormPage = document.querySelector('button.button.is-success');
        const isLayananPage = document.querySelector('button.btn-simpan.is-primary');

        panel.classList.add('mysika-hidden');
        fab.classList.remove('mysika-fab-active');

        if (formType === 'edom') {
            const jawabButtons = Array.from(document.querySelectorAll('td[data-label="Aksi"] button')).filter(btn => btn.innerText.trim().includes('Jawab'));
            
            if (jawabButtons.length > 0) {
                // Jika ada tombol "Jawab", kita berada di halaman list. Jalankan pengisian sekuensial.
                await fillAllEdomSequentially(rating);
            } else if (isEdomFormPage) {
                // Jika tidak ada tombol "Jawab" tapi ada tombol "Selesai", kita di halaman form. Isi form saat ini.
                await fillCurrentForm(rating);
            } else {
                showToast('Buka halaman kuesioner EDOM terlebih dahulu!', 'error', 4000);
            }
        } else if (formType === 'layanan') {
            if (isLayananPage) {
                await fillCurrentForm(rating);
            } else {
                showToast('Buka halaman kuesioner Layanan terlebih dahulu!', 'error', 4000);
            }
        }
    };

    document.getElementById('mysika-fill-edom').addEventListener('click', () => handleFill('edom'));
    document.getElementById('mysika-fill-layanan').addEventListener('click', () => handleFill('layanan'));
}

// --- LOGIKA UTAMA SAAT HALAMAN DIMUAT ---
window.addEventListener('load', () => {
    // Tambahkan sedikit jeda untuk memastikan semua elemen halaman sudah siap
    setTimeout(createFloatingUI, 500);
});