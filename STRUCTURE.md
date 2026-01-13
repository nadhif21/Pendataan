# Struktur Folder Project BKKBN

```
Pendataan/
│
├── index.html                 # Homepage BKKBN (Main Landing Page)
├── STRUCTURE.md               # Dokumentasi struktur folder
│
├── assets/                    # Folder untuk assets
│   └── bkkbn/                # Assets untuk website BKKBN
│       ├── bkkbn-styles.css  # Stylesheet BKKBN
│       ├── bkkbn-config.js   # Konfigurasi link Google Form & Apps Script
│       └── bkkbn-app.js      # JavaScript BKKBN
│
├── pendataan/                 # Website Pendataan (untuk Baduta & Ibu Hamil)
│   ├── index.html            # Halaman pendataan dengan filter kategori
│   ├── styles.css            # Stylesheet pendataan
│   ├── app.js                # JavaScript pendataan
│   └── config.js             # Konfigurasi Google Spreadsheet Apps Script
│
├── tpk/                       # Website untuk melihat data TPK
│   ├── index.html            # Halaman data TPK
│   ├── app.js                # JavaScript untuk TPK
│   └── config.js             # Konfigurasi Apps Script TPK
│
└── docs/                     # Dokumentasi
    ├── README.md             # Dokumentasi utama
    ├── APPS_SCRIPT_GUIDE.md  # Panduan lengkap Google Apps Script
    ├── DEPLOY.md             # Panduan deploy
    └── google-apps-script-example.js  # Contoh Google Apps Script
```

## Penjelasan Struktur

### Root Folder
- **index.html** - Halaman utama BKKBN yang berisi menu untuk TPK, SUB, dan BKB
- **STRUCTURE.md** - Dokumentasi struktur folder ini

### assets/bkkbn/
Berisi semua file yang terkait dengan website BKKBN homepage:
- **bkkbn-styles.css** - CSS untuk styling homepage
- **bkkbn-app.js** - JavaScript untuk logika aplikasi homepage
- **bkkbn-config.js** - Konfigurasi untuk link Google Form dan URL Apps Script untuk semua divisi

### pendataan/
Berisi website untuk melihat data pendataan Baduta & Ibu Hamil:
- **index.html** - Halaman pendataan dengan filter kategori (Baduta/Balita dan Ibu Hamil)
- **styles.css** - Stylesheet untuk halaman pendataan
- **app.js** - JavaScript untuk mengambil dan menampilkan data dengan filter kategori
- **config.js** - Konfigurasi Google Apps Script untuk data pendataan

### tpk/
Berisi website khusus untuk melihat data TPK:
- **index.html** - Halaman data TPK (tanpa filter kategori)
- **app.js** - JavaScript untuk mengambil dan menampilkan data TPK
- **config.js** - Konfigurasi Google Apps Script khusus untuk TPK

### docs/
Berisi dokumentasi project:
- **README.md** - Dokumentasi utama dan quick start guide
- **APPS_SCRIPT_GUIDE.md** - Panduan lengkap cara membuat dan deploy Google Apps Script
- **DEPLOY.md** - Panduan cara deploy website
- **google-apps-script-example.js** - Contoh kode Google Apps Script siap pakai

## Cara Menggunakan

1. **Buka Homepage:**
   - Buka `index.html` di browser
   - Ini adalah halaman utama dengan menu TPK, SUB, dan BKB

2. **Akses Data:**
   - **TPK**: Klik "Melihat Data" pada menu TPK → akan membuka `tpk/index.html`
   - **SUB**: Klik "Melihat Data" pada menu SUB → akan membuka halaman sesuai konfigurasi Apps Script
   - **BKB**: Klik "Melihat Data" pada menu BKB → akan membuka halaman sesuai konfigurasi Apps Script
   - **Pendataan**: Bisa langsung akses `pendataan/index.html` untuk melihat data dengan filter kategori

3. **Konfigurasi:**
   - **Homepage**: Edit `assets/bkkbn/bkkbn-config.js` untuk mengatur:
     - Link Google Form untuk mendata (TPK, SUB, BKB)
     - URL Apps Script untuk melihat data (TPK, SUB, BKB)
   - **Pendataan**: Edit `pendataan/config.js` untuk mengatur Apps Script URL
   - **TPK**: Edit `tpk/config.js` untuk mengatur Apps Script URL khusus TPK

## Catatan Penting

- Semua path relatif sudah disesuaikan dengan struktur folder
- Setiap divisi (TPK, SUB, BKB) dapat memiliki Apps Script URL sendiri
- Folder `tpk/` menggunakan stylesheet dari `pendataan/styles.css` untuk konsistensi
- Struktur ini memudahkan untuk menambah folder `sub/` dan `bkb/` nanti dengan struktur yang sama
- Lihat `docs/APPS_SCRIPT_GUIDE.md` untuk panduan lengkap membuat Apps Script
