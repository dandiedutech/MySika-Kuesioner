// Dibuat oleh dandisubhani_
// Versi 3.0

(function() {
    'use strict';

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const pageCheckers = {
        isEdomListPage: () => !!document.querySelector('tr i.mdi-minus-circle'),
        isEdomFormPage: () => !!document.querySelector('button.is-success.is-fullwidth'),
        isLayananFormPage: () => !!document.querySelector('button.btn-simpan.is-primary'),
    };

    /**
     * Menambahkan CSS untuk merender UI sesuai gambar.
     */
    function addCustomStyles() {
        const styles = `
            #mysika-fab {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background-color: #1e3a8a; /* Dark Blue */
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 9998;
                transition: transform 0.3s ease;
            }
            #mysika-fab.mysika-fab-active {
                transform: rotate(45deg);
            }
            #mysika-fab img {
                width: 32px;
                height: 32px;
            }
            #mysika-panel {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 300px;
                background-color: #ffffff;
                border-radius: 16px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                z-index: 9999;
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                transition: transform 0.3s ease, opacity 0.3s ease;
                border: 1px solid #e2e8f0;
            }
            #mysika-panel.mysika-hidden {
                transform: translateY(20px);
                opacity: 0;
                pointer-events: none;
            }
            .mysika-header-new {
                padding: 20px;
                text-align: center;
            }
            .mysika-title-new {
                font-size: 20px;
                font-weight: 700;
                color: #1e293b;
            }
            .mysika-subtitle-new {
                font-size: 14px;
                color: #64748b;
            }
            .mysika-content-new {
                padding: 0 20px 20px 20px;
            }
            .mysika-options-label-new {
                font-size: 14px;
                font-weight: 600;
                color: #475569;
                margin-bottom: 12px;
                margin-top: 16px;
            }
            /* Toggle Button Styling */
            .mysika-toggle-group {
                display: flex;
                background-color: #f1f5f9;
                border-radius: 10px;
                padding: 4px;
            }
            .mysika-toggle-group input[type="radio"] {
                display: none;
            }
            .mysika-toggle-group label {
                flex: 1;
                padding: 8px;
                text-align: center;
                font-size: 9px;
                font-weight: 600;
                color: #475569;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.2s, color 0.2s;
            }
            .mysika-toggle-group input[type="radio"]:checked + label {
                background-color: #2563eb;
                color: white;
                box-shadow: 0 2px 5px rgba(37, 99, 235, 0.3);
            }
            /* Action Button Styling */
            .mysika-button-group-new {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .mysika-action-button-new {
                padding: 14px;
                border: none;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 700;
                color: white;
                cursor: pointer;
                transition: filter 0.2s;
            }
            .mysika-action-button-new:hover {
                filter: brightness(95%);
            }
            .mysika-action-button-new.edom {
                background-color: #14b8a6; /* Teal */
            }
            .mysika-action-button-new.layanan {
                background-color: #1d4ed8; /* Darker Blue */
            }
            .mysika-footer-new {
                padding: 12px;
                text-align: center;
                font-size: 12px;
                background-color: #f8fafc;
                border-top: 1px solid #e2e8f0;
            }
            .mysika-footer-new a {
                color: #2563eb;
                text-decoration: none;
                font-weight: 600;
            }
            /* Toast Notifcation */
            #mysika-toast {
                position: fixed; bottom: 20px; right: -350px; background-color: #1e293b;
                color: white; padding: 14px 20px; border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 10000;
                display: flex; align-items: center; transition: right 0.5s ease-in-out;
            }
            #mysika-toast.mysika-toast-visible { right: 20px; }
            .mysika-toast-icon { margin-right: 12px; font-size: 18px; }
            .mysika-toast-info .mysika-toast-icon::before { content: 'ℹ️'; }
            .mysika-toast-success .mysika-toast-icon::before { content: '✅'; }
            .mysika-toast-error .mysika-toast-icon::before { content: '❌'; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    function showToast(message, type = 'info', duration = 3000) {
        const existingToast = document.getElementById('mysika-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.id = 'mysika-toast';
        toast.className = `mysika-toast mysika-toast-${type}`;
        toast.innerHTML = `<div class="mysika-toast-icon"></div><div class="mysika-toast-message">${message}</div>`;
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
     * Membuat UI tombol mengambang dengan desain baru.
     */
    function createAndInjectUI() {
        if (document.getElementById('mysika-fab')) return;

        const fab = document.createElement('div');
        fab.id = 'mysika-fab';
        fab.innerHTML = `<img src="${chrome.runtime.getURL("images/icon48.png")}" alt="MySika">`;

        const panel = document.createElement('div');
        panel.id = 'mysika-panel';
        panel.classList.add('mysika-hidden');

        // Menggunakan struktur HTML baru untuk desain modern
        panel.innerHTML = `
            <div class="mysika-header-new">
                <div class="mysika-title-new">MySika Kuesioner</div>
                <div class="mysika-subtitle-new">Otomatisasi Pengisian</div>
            </div>
            <div class="mysika-content-new">
                <div class="mysika-options-label-new">1. Pilih Opsi Penilaian</div>
                <div class="mysika-toggle-group">
                    <input type="radio" id="mysika-sangat-baik" name="mysika-rating" value="sangat-baik" checked>
                    <label for="mysika-sangat-baik">SANGAT BAIK</label>
                    <input type="radio" id="mysika-baik" name="mysika-rating" value="baik">
                    <label for="mysika-baik">BAIK</label>
                    <input type="radio" id="mysika-acak" name="mysika-rating" value="acak">
                    <label for="mysika-acak">ACAK</label>
                </div>
                <div class="mysika-options-label-new">2. Pilih Aksi</div>
                <div class="mysika-button-group-new">
                    <button id="mysika-fill-edom" class="mysika-action-button-new edom">Isi Form EDOM</button>
                    <button id="mysika-fill-layanan" class="mysika-action-button-new layanan">Isi Form Layanan</button>
                </div>
            </div>
            <div class="mysika-footer-new">
                Dibuat oleh <a href="https://www.instagram.com/dandisubhani_" target="_blank">@dandisubhani_</a>
            </div>
        `;

        document.body.appendChild(fab);
        document.body.appendChild(panel);
        
        const closePanel = () => {
             panel.classList.add('mysika-hidden');
             fab.classList.remove('mysika-fab-active');
        };

        fab.addEventListener('click', () => {
            panel.classList.toggle('mysika-hidden');
            fab.classList.toggle('mysika-fab-active');
        });
        
        // Event listener untuk tombol EDOM yang "pintar"
        document.getElementById('mysika-fill-edom').addEventListener('click', () => {
            const rating = document.querySelector('input[name="mysika-rating"]:checked').value;
            if (pageCheckers.isEdomListPage()) {
                initiateFillAllEdom(rating);
                closePanel();
            } else if (pageCheckers.isEdomFormPage()) {
                fillActiveForm(rating);
                closePanel();
            } else {
                showToast('Buka halaman kuesioner EDOM (daftar atau formulir)!', 'error');
            }
        });
        
        // Event listener untuk tombol Layanan
        document.getElementById('mysika-fill-layanan').addEventListener('click', () => {
             const rating = document.querySelector('input[name="mysika-rating"]:checked').value;
             if (pageCheckers.isLayananFormPage()) {
                fillActiveForm(rating);
                closePanel();
             } else {
                showToast('Buka tab "Layanan" dan masuk ke formnya!', 'error');
             }
        });
    }

    /**
     * Fungsi untuk mengisi satu form kuesioner yang sedang aktif (Logika Inti).
     */
    async function fillActiveForm(ratingOption) {
        const isEdomForm = pageCheckers.isEdomFormPage();
        const formType = isEdomForm ? 'EDOM' : 'Layanan';
        showToast(`Mengisi form ${formType}...`, 'info', 4000);
        try {
            const questionRows = document.querySelectorAll('.b-tabs .tab-content .field, .soal-kuesioner-table tbody tr');
            for (const row of questionRows) {
                if (row.querySelectorAll('input[type="radio"]').length === 0) continue;

                let radioToClick;
                let choice = ratingOption;
                if (ratingOption === 'acak') {
                    choice = Math.random() < 0.75 ? 'sangat-baik' : 'baik';
                }
                
                let selector;
                if (isEdomForm) {
                    selector = choice === 'sangat-baik' ? 'input[type="radio"][value="4"]' : 'input[type="radio"][value="3"]';
                } else {
                    selector = choice === 'sangat-baik' ? 'input[type="radio"][value="1"]' : 'input[type="radio"][value="2"]';
                }
                radioToClick = row.querySelector(selector);
                
                if (radioToClick) {
                    radioToClick.click();
                    await sleep(10);
                }
            }

            const textareas = document.querySelectorAll('textarea.textarea');
            const defaultText = "Secara keseluruhan sudah sangat baik dan memenuhi harapan. Terima kasih.";
            if (isEdomForm) {
                if (textareas.length > 0) {
                    textareas[0].value = "Pengajaran sudah sangat baik, materi mudah dipahami, dan dosen sangat membantu. Terima kasih.";
                    textareas[0].dispatchEvent(new Event('input', { bubbles: true }));
                }
                const radioYa = document.querySelector('input[type="radio"][value="Y"]');
                if (radioYa) radioYa.click();
            } else {
                for (const textarea of textareas) {
                    textarea.value = defaultText;
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }

            const finishButton = document.querySelector('button.is-success.is-fullwidth, button.btn-simpan.is-primary');
            if (finishButton) {
                await sleep(250);
                finishButton.click();
                await sleep(500);
                const activeModal = document.querySelector('div.modal.is-active');
                if (activeModal) {
                    const confirmButton = activeModal.querySelector('button.is-success') || Array.from(activeModal.querySelectorAll('button')).find(btn => btn.innerText.trim().toLowerCase() === 'ya, selesai');
                    if (confirmButton) {
                        showToast('Menyimpan formulir...', 'success', 2000);
                        confirmButton.click();
                    }
                }
            } else {
                 showToast('Tombol simpan tidak ditemukan!', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan: ' + error.message, 'error', 5000);
            sessionStorage.removeItem('mysika_is_filling_all');
        }
    }
    
    function initiateFillAllEdom(ratingOption) {
        sessionStorage.setItem('mysika_is_filling_all', 'true');
        sessionStorage.setItem('mysika_rating_option', ratingOption);
        sessionStorage.setItem('mysika_next_index', '0');
        processNextEdom();
    }

    function processNextEdom() {
        const nextIndex = parseInt(sessionStorage.getItem('mysika_next_index') || '0', 10);
        const answerButtons = Array.from(document.querySelectorAll('tr'))
            .filter(row => row.querySelector('i.mdi-minus-circle'))
            .map(row => row.querySelector('button.is-small span:last-child'))
            .filter(span => span && span.innerText.trim() === 'Jawab')
            .map(span => span.closest('button'));

        if (nextIndex < answerButtons.length) {
            showToast(`Mengisi otomatis: ${nextIndex + 1} dari ${answerButtons.length}...`, 'info', 3000);
            sessionStorage.setItem('mysika_next_index', nextIndex + 1);
            answerButtons[nextIndex].click();
        } else {
            sessionStorage.removeItem('mysika_is_filling_all');
            sessionStorage.removeItem('mysika_rating_option');
            sessionStorage.removeItem('mysika_next_index');
            showToast('Semua kuesioner EDOM telah selesai!', 'success', 5000);
        }
    }

    // --- LOGIKA UTAMA SAAT HALAMAN DIMUAT ---
    function main() {
        addCustomStyles();
        createAndInjectUI();
        if (sessionStorage.getItem('mysika_is_filling_all') === 'true') {
            const ratingOption = sessionStorage.getItem('mysika_rating_option');
            if (pageCheckers.isEdomFormPage()) {
                setTimeout(() => fillActiveForm(ratingOption), 500);
            } else if (pageCheckers.isEdomListPage()) {
                setTimeout(processNextEdom, 1000);
            }
        }
    }
    
    // Memberi sedikit jeda agar semua elemen SIKA termuat sebelum skrip berjalan
    setTimeout(main, 1500);

})();