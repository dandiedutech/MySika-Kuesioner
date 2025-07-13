async function _0x5f3a(_0x1b2c,_0x3d4e){const _0x4a5f=_0x6b7c=>new Promise(_0x8d9e=>setTimeout(_0x8d9e,_0x6b7c));try{const _0xf0a1=document.querySelectorAll('.soal-kuesioner-table tbody tr');let _0xb2c3=0;for(const _0xd4e5 of _0xf0a1){let _0xf6a7=null;if(_0x1b2c==='sangat-baik'){_0xf6a7=_0xd4e5.querySelector('td:nth-child(3) input[type="radio"][value="1"]')}else if(_0x1b2c==='baik'){_0xf6a7=_0xd4e5.querySelector('td:nth-child(4) input[type="radio"][value="2"]')}else if(_0x1b2c==='acak'){const _0xb8c9=Math.random()<0.7?'sangat-baik':'baik';const _0xdaeb=_0xb8c9==='sangat-baik'?'td:nth-child(3) input[type="radio"][value="1"]':'td:nth-child(4) input[type="radio"][value="2"]';_0xf6a7=_0xd4e5.querySelector(_0xdaeb)}if(_0xf6a7){_0xd4e5.scrollIntoView({behavior:'smooth',block:'center'});await _0x4a5f(100);_0xf6a7.click();_0xb2c3++;await _0x4a5f(50)}}if(_0x3d4e==='edom'){const _0xfc0d=document.querySelector('input[type="radio"][value="Y"]');if(_0xfc0d){_0xfc0d.parentElement.scrollIntoView({behavior:'smooth',block:'center'});await _0x4a5f(150);_0xfc0d.click()}const _0x1e2f=document.querySelector('textarea.textarea');if(_0x1e2f){_0x1e2f.scrollIntoView({behavior:'smooth',block:'center'});await _0x4a5f(150);_0x1e2f.value="Pengajaran sudah sangat baik, materi mudah dipahami, dan dosen sangat membantu. Terima kasih.";_0x1e2f.dispatchEvent(new Event('input',{bubbles:true}))}}else if(_0x3d4e==='layanan'){const _0x3041=document.querySelectorAll('textarea.textarea');if(_0x3041.length>0){for(const _0x5263 of _0x3041){_0x5263.scrollIntoView({behavior:'smooth',block:'center'});await _0x4a5f(150);_0x5263.value="Secara keseluruhan sudah sangat baik dan memenuhi harapan. Terima kasih.";_0x5263.dispatchEvent(new Event('input',{bubbles:true}))}}}const _0x7485=_0x3d4e==='edom'?'button.button.is-success':'button.btn-simpan.is-primary';const _0x96a7=document.querySelector(_0x7485);if(_0xb2c3>0&&_0x96a7){_0x96a7.scrollIntoView({behavior:'smooth',block:'center'});await _0x4a5f(200);_0x96a7.click();await _0x4a5f(500);const _0xb8c9=document.querySelector('div.modal.is-active');if(_0xb8c9){const _0xdaeb=_0xb8c9.querySelector('button.is-success')||Array.from(_0xb8c9.querySelectorAll('button')).find(_0xf0a1=>_0xf0a1.innerText.trim()==='Ya, selesai');if(_0xdaeb){_0xdaeb.click();console.log(`MySika: Pengisian ${_0x3d4e} selesai dan terkonfirmasi.`)}}}else{console.warn(`MySika: Tombol 'Selesai'/'Simpan' untuk form ${_0x3d4e} tidak ditemukan.`)}}catch(_0x1e2f){console.error("MySika Error: ",_0x1e2f)}}function _0x3041(){const _0x5263=document.createElement('div');_0x5263.id='mysika-fab';_0x5263.innerHTML=`<img src="${chrome.runtime.getURL("images/icon48.png")}" alt="MySika">`;const _0x7485=document.createElement('div');_0x7485.id='mysika-panel';_0x7485.classList.add('mysika-hidden');_0x7485.innerHTML=`
        <div class="mysika-header">
            <div class="mysika-title">MySika Kuesioner</div>
            <div class="mysika-subtitle">Otomatisasi Pengisian</div>
        </div>
        <div class="mysika-content">
            <div class="mysika-options-label">Pilih Opsi Penilaian</div>
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
            <div class="mysika-button-group">
                <button id="mysika-fill-edom" class="mysika-action-button">Isi EDOM</button>
                <button id="mysika-fill-layanan" class="mysika-action-button">Isi Layanan</button>
            </div>
        </div>
        <div class="mysika-footer">
            Dibuat oleh <a href="https://www.instagram.com/dandisubhani_" target="_blank">@dandisubhani_</a>
        </div>
    `;document.body.appendChild(_0x5263);document.body.appendChild(_0x7485);_0x5263.addEventListener('click',()=>{_0x7485.classList.toggle('mysika-hidden');_0x5263.classList.toggle('mysika-fab-active')});document.getElementById('mysika-fill-edom').addEventListener('click',()=>{const _0x96a7=document.querySelector('input[name="mysika-rating"]:checked').value;_0x5f3a(_0x96a7,'edom');_0x7485.classList.add('mysika-hidden');_0x5263.classList.remove('mysika-fab-active')});document.getElementById('mysika-fill-layanan').addEventListener('click',()=>{const _0x96a7=document.querySelector('input[name="mysika-rating"]:checked').value;_0x5f3a(_0x96a7,'layanan');_0x7485.classList.add('mysika-hidden');_0x5263.classList.remove('mysika-fab-active')})}window.addEventListener('load',_0x3041);
