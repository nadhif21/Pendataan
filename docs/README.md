# Website Mobile-Friendly untuk Menampilkan Data dari Google Spreadsheet

Website responsive yang dapat mengambil dan menampilkan data dari Google Spreadsheet dengan tampilan yang mobile-friendly menggunakan **Google Apps Script**.

## 🚀 Fitur

- ✅ Mobile-friendly dan responsive design
- ✅ Mengambil data dari Google Spreadsheet menggunakan **Google Apps Script**
- ✅ Auto-refresh data
- ✅ Tampilan tabel yang rapi di desktop
- ✅ Tampilan card-based di mobile
- ✅ Modern UI dengan gradient design
- ✅ Loading indicator
- ✅ Error handling
- ✅ Konfigurasi mudah untuk multiple divisi (TPK, SUB, BKB)

## 📋 Cara Setup

### ⚡ Quick Start: Menggunakan Google Apps Script (RECOMMENDED)

Website ini menggunakan **Google Apps Script** untuk mengambil data dari Google Spreadsheet. Ini adalah metode yang paling aman, mudah, dan tidak memiliki masalah CORS.

#### Langkah-langkah:

1. **Baca panduan lengkap di:** [`docs/APPS_SCRIPT_GUIDE.md`](APPS_SCRIPT_GUIDE.md)
   
2. **Ringkasan cepat:**
   - Buka Google Spreadsheet Anda
   - Klik `Extensions` → `Apps Script`
   - Copy kode dari panduan atau file `docs/google-apps-script-example.js`
   - Deploy sebagai Web App dengan akses "Anyone"
   - Copy URL yang diberikan
   - Paste URL di file konfigurasi (lihat di bawah)

#### Konfigurasi URL Apps Script

**Untuk halaman pendataan (`pendataan/config.js`):**
```javascript
const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
};
```

**Untuk halaman BKKBN (`assets/bkkbn/bkkbn-config.js`):**
```javascript
const BKKBN_CONFIG = {
    // ... konfigurasi lainnya ...
    
    // URL untuk melihat data TPK (mengarah ke tpk/index.html)
    TPK_LIHAT_DATA_URL: 'tpk/index.html',
    
    // URL Apps Script untuk melihat data SUB
    SUB_LIHAT_DATA_URL: 'https://script.google.com/macros/s/YOUR_SUB_SCRIPT_ID/exec',
    
    // URL Apps Script untuk melihat data BKB
    BKB_LIHAT_DATA_URL: 'https://script.google.com/macros/s/YOUR_BKB_SCRIPT_ID/exec'
};
```

**Untuk halaman TPK (`tpk/config.js`):**
```javascript
const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_TPK_SCRIPT_ID/exec'
};
```

📖 **Panduan lengkap dengan screenshot dan troubleshooting tersedia di:** [`docs/APPS_SCRIPT_GUIDE.md`](APPS_SCRIPT_GUIDE.md)

## 📱 Cara Menggunakan

1. **Buka `index.html` di browser** (bisa langsung double-click atau gunakan local server)
2. **Atau gunakan local server:**
   ```bash
   # Dengan Python
   python -m http.server 8000
   
   # Dengan PHP
   php -S localhost:8000
   
   # Dengan Node.js (http-server)
   npx http-server
   ```
3. **Buka browser dan akses:** `http://localhost:8000`

## 🎨 Customization

### Mengubah Warna
Edit variabel CSS di file `styles.css`:
```css
:root {
    --primary-color: #4a90e2; /* Warna utama */
    --secondary-color: #50c878; /* Warna sekunder */
    --background-color: #f5f7fa; /* Warna background */
}
```

### Mengubah Judul
Edit di file `index.html`:
```html
<h1>📊 Data Pendataan</h1>
```

## 📝 Catatan Penting

- **Apps Script Deployment:** Pastikan deployment di-set sebagai `Anyone` agar website bisa mengakses tanpa login
- **Format Data:** Pastikan baris pertama spreadsheet adalah header (nama kolom)
- **Multiple Divisi:** Setiap divisi (TPK, SUB, BKB) bisa menggunakan Apps Script terpisah dengan URL masing-masing

## 🐛 Troubleshooting

### Data tidak muncul
- Pastikan URL Apps Script di config.js sudah benar
- Pastikan Apps Script sudah di-deploy dengan akses "Anyone"
- Cek console browser (F12) untuk error message
- Test URL Apps Script langsung di browser untuk melihat response

### Error "Script function not found: doGet"
- Pastikan fungsi `doGet()` ada di kode Apps Script
- Pastikan nama fungsi tepat `doGet` (case-sensitive)
- Lihat panduan di `docs/APPS_SCRIPT_GUIDE.md`

### Error "Access denied" atau "Authorization required"
- Pastikan deployment di-set sebagai "Anyone"
- Pastikan Anda sudah authorize access saat deploy
- Coba deploy ulang dan authorize lagi

### Error CORS
- Apps Script seharusnya tidak memiliki masalah CORS
- Jika masih ada error, pastikan deployment sudah benar

### Mobile tidak responsive
- Pastikan viewport meta tag ada di HTML
- Clear cache browser
- Test di device yang berbeda

📖 **Untuk troubleshooting lebih lengkap, lihat:** [`docs/APPS_SCRIPT_GUIDE.md`](APPS_SCRIPT_GUIDE.md)

## 📄 Lisensi

Free to use untuk keperluan pribadi dan komersial.

