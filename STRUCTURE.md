# Struktur Folder Project BKKBN

```
Pendataan/
│
├── index.html                 # Homepage BKKBN (Main Landing Page)
│
├── assets/                    # Folder untuk assets
│   └── bkkbn/                # Assets untuk website BKKBN
│       ├── bkkbn-styles.css  # Stylesheet BKKBN
│       ├── bkkbn-config.js   # Konfigurasi link Google Form
│       └── bkkbn-app.js      # JavaScript BKKBN
│
├── pendataan/                 # Website Pendataan Ibu dan Anak (TPK)
│   ├── index.html            # Halaman pendataan
│   ├── styles.css            # Stylesheet pendataan
│   ├── app.js                # JavaScript pendataan
│   └── config.js             # Konfigurasi Google Spreadsheet
│
└── docs/                     # Dokumentasi
    ├── README.md             # Dokumentasi utama
    ├── DEPLOY.md             # Panduan deploy
    └── google-apps-script-example.js  # Contoh Google Apps Script
```

## Penjelasan Struktur

### Root Folder
- **index.html** - Halaman utama BKKBN yang berisi menu untuk TPK, SUB, dan BKB

### assets/bkkbn/
Berisi semua file yang terkait dengan website BKKBN:
- CSS untuk styling homepage
- JavaScript untuk logika aplikasi
- Konfigurasi untuk link Google Form

### pendataan/
Berisi website untuk melihat data pendataan (digunakan oleh TPK):
- File HTML, CSS, dan JavaScript untuk menampilkan data dari Google Spreadsheet
- Konfigurasi untuk koneksi ke Google Spreadsheet

### docs/
Berisi dokumentasi project:
- README.md - Dokumentasi utama
- DEPLOY.md - Panduan cara deploy website
- google-apps-script-example.js - Contoh kode Google Apps Script

## Cara Menggunakan

1. **Buka Homepage:**
   - Buka `index.html` di browser
   - Ini adalah halaman utama dengan menu TPK, SUB, dan BKB

2. **Akses Pendataan:**
   - Dari homepage, klik "Melihat Data" pada menu TPK
   - Akan membuka `pendataan/index.html`

3. **Konfigurasi:**
   - Edit `assets/bkkbn/bkkbn-config.js` untuk mengatur link Google Form
   - Edit `pendataan/config.js` untuk mengatur koneksi ke Google Spreadsheet

## Catatan

- Semua path relatif sudah disesuaikan dengan struktur folder baru
- Website BKKBN di root akan mengarahkan ke pendataan di folder `pendataan/`
- Struktur ini memudahkan untuk menambah website SUB dan BKB nanti
