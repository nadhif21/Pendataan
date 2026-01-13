# BKKBN Kelurahan Way Kandis - Sistem Pendataan

Sistem informasi untuk Badan Kependudukan dan Keluarga Berencana Nasional (BKKBN) Kelurahan Way Kandis.

## 📁 Struktur Project

```
Pendataan/
├── index.html              # Homepage utama
├── assets/bkkbn/          # Assets homepage (CSS, JS, Config)
├── pendataan/             # Halaman pendataan Baduta & Ibu Hamil
├── tpk/                   # Halaman data TPK
└── docs/                  # Dokumentasi lengkap
```

## 🚀 Quick Start

1. **Buka Homepage**: Buka `index.html` di browser
2. **Konfigurasi Apps Script**: 
   - Lihat panduan di `docs/APPS_SCRIPT_GUIDE.md`
   - Edit file config di masing-masing folder untuk menambahkan URL Apps Script

## 📚 Dokumentasi

- **Struktur Folder**: Lihat `STRUCTURE.md`
- **Panduan Apps Script**: Lihat `docs/APPS_SCRIPT_GUIDE.md`
- **Dokumentasi Lengkap**: Lihat `docs/README.md`

## 🔧 Konfigurasi

### Homepage (`assets/bkkbn/bkkbn-config.js`)
- Link Google Form untuk mendata
- URL Apps Script untuk melihat data

### Pendataan (`pendataan/config.js`)
- URL Apps Script untuk data pendataan

### TPK (`tpk/config.js`)
- URL Apps Script khusus untuk TPK

## 📝 Catatan

- Semua data diambil dari Google Spreadsheet menggunakan Google Apps Script
- Setiap divisi (TPK, SUB, BKB) dapat memiliki Apps Script URL sendiri
- Lihat `docs/APPS_SCRIPT_GUIDE.md` untuk panduan lengkap membuat Apps Script
