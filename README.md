<div align="center">

# 🎓 MySika Kuesioner Otomatis v3.0

### Ekstensi Chrome Level "Sakti" untuk Mahasiswa Unindra

*Mengisi semua kuesioner EDOM yang belum selesai secara berurutan hanya dengan satu kali klik*

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://instagram.com/dandisubhani_)
[![Version](https://img.shields.io/badge/Version-3.0.0-blue.svg)](https://github.com/dandiedutech/MySika-Kuesioner)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-yellow.svg)](https://chrome.google.com)
[![Security](https://img.shields.io/badge/Security-100%25%20Safe-brightgreen.svg)](#-keamanan-terjamin)

![MySika Preview](https://files.catbox.moe/p71vvw.jpg)

---

</div>

## 🛡️ Keamanan Terjamin

<div align="center">

### **⚡ 100% Bersih & Aman ⚡**

**Ekstensi ini bebas dari virus, malware, spyware, atau kode berbahaya**  
✅ Tidak mengumpulkan data pribadi  
✅ Tidak menyimpan informasi login  
✅ Hanya menjalankan skrip pengisian formulir  
✅ Open source & transparan  
✅ Kode sumber dapat diperiksa langsung  

</div>

---

## ✨ Fitur Unggulan (v3.0)

<table>
<tr>
<td width="50%">

### 🚀 **Isi Semua Sekaligus**
Fitur andalan untuk mengisi seluruh kuesioner EDOM yang berstatus "Belum Selesai" secara otomatis dan berurutan hanya dengan satu klik.

### ⚡ **Proses Super Cepat**
Logika baru yang menghilangkan efek gulir untuk menyelesaikan pengisian dalam hitungan detik.

### 🔔 **Notifikasi Modern**
Pemberitahuan mengambang yang informatif akan muncul untuk setiap tahap proses, bukan lagi menggunakan alert yang mengganggu.

</td>
<td width="50%">

### 🎨 **Antarmuka Terintegrasi**
Tombol mengambang yang elegan dan panel kontrol modern langsung di halaman SIKA.

### ⚙️ **Pilihan Fleksibel**
Tetap bisa memilih antara "Sangat Baik", "Baik", atau "Acak" untuk semua pengisian.

### ✍️ **Pengisian Cerdas**
Otomatis mengisi semua checkbox dan text area yang diperlukan di setiap formulir.

</td>
</tr>
</table>

---

## 📂 Struktur File Proyek

Struktur file telah disesuaikan untuk mendukung fungsionalitas pengisian berantai:

```
MySika-Kuesioner/
│
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── manifest.json       # Konfigurasi inti ekstensi
├── content.css         # Desain tombol & notifikasi mengambang
├── content.js          # Logika utama (bisa diobfuscate)
│     
└── README.md  # File informasi ini 
```

---

## 📥 Instalasi

> **Catatan**: Karena ekstensi ini tidak tersedia di Chrome Web Store, instalasi dilakukan secara manual.

### **Metode 1: Download Langsung**

1. **📁 Download ZIP File**  
   [![Download ZIP](https://img.shields.io/badge/📁_Download-ZIP_File-blue?style=for-the-badge&logo=download)](https://files.catbox.moe/mu7iw2.zip)

2. **📂 Ekstrak File**  
   Ekstrak file ZIP ke folder yang mudah diakses.

3. **🔧 Buka Chrome Extensions**  
   Navigasi ke `chrome://extensions/` di browser Chrome.

4. **🛠️ Aktifkan Developer Mode**  
   Toggle **"Developer mode"** di pojok kanan atas.

5. **📋 Load Unpacked Extension**  
   Klik **"Load unpacked"** dan pilih folder hasil ekstrak.

6. **🎉 Instalasi Selesai!**  
   Ekstensi akan aktif secara otomatis di halaman kuesioner SIKA.

### **Metode 2: Clone Repository**

```bash
git clone https://github.com/dandiedutech/MySika-Kuesioner
cd MySika-Kuesioner
```

Lalu ikuti langkah 3-6 dari metode 1.

---

## 📱 Cara Penggunaan

<div align="center">

### **🚀 Mengisi Semua EDOM Sekaligus (Cara Cepat)**

</div>

| Step | Aksi | Deskripsi |
|------|------|-----------|
| **1** | 🌐 **Buka Halaman Kuesioner** | Login ke portal SIKA dan buka halaman Kuesioner yang menampilkan daftar mata kuliah |
| **2** | 🔵 **Klik Tombol Mengambang** | Klik tombol biru mengambang di pojok kanan bawah |
| **3** | ⚙️ **Pilih Opsi Penilaian** | Tentukan jenis penilaian: Sangat Baik, Baik, atau Acak |
| **4** | 🎯 **Klik "Isi Semua EDOM"** | Klik tombol **"Isi Semua EDOM Sekaligus"** |
| **5** | ✨ **Enjoy the Magic!** | Duduk dan saksikan ekstensi bekerja otomatis dengan notifikasi real-time |

<div align="center">

### **📋 Mengisi Form Layanan**

</div>

| Step | Aksi | Deskripsi |
|------|------|-----------|
| **1** | 🌐 **Masuk ke Tab Layanan** | Navigasi ke tab Layanan di halaman Kuesioner |
| **2** | 🔵 **Klik Tombol Mengambang** | Klik tombol biru mengambang di pojok kanan bawah |
| **3** | ⚙️ **Pilih Opsi Penilaian** | Tentukan jenis penilaian yang diinginkan |
| **4** | 🎯 **Klik "Isi Form Layanan"** | Klik tombol **"Isi Form Layanan Saat Ini"** |

---

## 🎮 Demo & Screenshots

<div align="center">

### **Before & After**

| Sebelum | Sesudah |
|---------|---------|
| ![Before](https://files.catbox.moe/7s6pam.jpg) | ![After](https://files.catbox.moe/rhha28.jpg) |

*Dari mengisi manual puluhan kuesioner → menjadi hanya satu klik untuk semua!*

</div>

---

## 🔧 Troubleshooting

<details>
<summary><strong>❓ Tombol mengambang tidak muncul</strong></summary>

- Pastikan ekstensi sudah di-load dengan benar
- Refresh halaman SIKA
- Cek apakah Developer mode sudah aktif
- Pastikan berada di halaman kuesioner yang benar

</details>

<details>
<summary><strong>❓ Proses terhenti di tengah jalan</strong></summary>

- Jangan scroll atau klik area lain saat proses berjalan
- Pastikan koneksi internet stabil
- Tunggu hingga notifikasi "Selesai!" muncul
- Jika ada error, coba refresh dan ulangi

</details>

<details>
<summary><strong>❓ Notifikasi tidak muncul</strong></summary>

- Pastikan tidak ada popup blocker yang aktif
- Coba disable ekstensi lain yang mungkin konflik
- Refresh halaman dan coba lagi

</details>

---

## 🆕 What's New in v3.0

- ✅ **Pengisian Massal**: Isi semua kuesioner EDOM sekaligus
- ✅ **Notifikasi Real-time**: Tracking progress dengan notifikasi modern
- ✅ **Performa Optimal**: Logika baru tanpa scrolling untuk kecepatan maksimal
- ✅ **UI/UX Improved**: Antarmuka yang lebih elegan dan terintegrasi
- ✅ **Error Handling**: Penanganan error yang lebih baik

---

## 🛣️ Roadmap

- [ ] 🔄 Auto-update system
- [ ] 📊 Statistics dashboard
- [ ] 🎨 Multiple themes
- [ ] 📱 Mobile version support
- [ ] 🔔 Advanced notification system
- [ ] 🌐 Multi-language support
- [ ] 📈 Progress analytics

---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## ⚠️ Disclaimer

<div align="center">

### **Penting untuk Dibaca**

**MySika Kuesioner Otomatis** adalah alat bantu **tidak resmi** dan tidak berafiliasi dengan Universitas Indraprasta PGRI.

✅ **Gunakan dengan bijak dan bertanggung jawab**  
⚠️ **Risiko penggunaan ditanggung oleh pengguna**  
📚 **Pastikan tetap memberikan feedback yang konstruktif**  

</div>

---

<div align="center">

## 💝 Credits

**Dibuat dengan ❤️ oleh [@dandisubhani_](https://www.instagram.com/dandisubhani_)**

*Jika ekstensi ini membantu, jangan lupa beri ⭐ dan share ke teman-teman!*

---

### 📞 Contact & Support

[![Instagram](https://img.shields.io/badge/Instagram-@dandisubhani_-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/dandisubhani_)
[![Email](https://img.shields.io/badge/Email-Support-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:dandiedutech@gmail.com)

---

**⚡ Made for Unindra Students, by Unindra Students ⚡**

</div>
