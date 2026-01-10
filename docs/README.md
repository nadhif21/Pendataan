# Website Mobile-Friendly untuk Menampilkan Data dari Google Spreadsheet

Website responsive yang dapat mengambil dan menampilkan data dari Google Spreadsheet dengan tampilan yang mobile-friendly.

## 🚀 Fitur

- ✅ Mobile-friendly dan responsive design
- ✅ Mengambil data dari Google Spreadsheet
- ✅ Auto-refresh data
- ✅ Tampilan tabel yang rapi di desktop
- ✅ Tampilan card-based di mobile
- ✅ Modern UI dengan gradient design
- ✅ Loading indicator
- ✅ Error handling

## 📋 Cara Setup

### Metode 1: Menggunakan CSV Export (Termudah - Recommended untuk Testing)

1. **Buka Google Spreadsheet Anda**
2. **Publish Spreadsheet:**
   - Klik `File` → `Share` → `Publish to web`
   - Pilih format: `Comma-separated values (.csv)`
   - Klik `Publish`
3. **Copy URL yang muncul**, contoh:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/export?format=csv&gid=0
   ```
4. **Edit file `config.js`:**
   ```javascript
   CSV_URL: 'PASTE_URL_DISINI'
   ```

### Metode 2: Menggunakan Google Apps Script (Recommended untuk Production)

1. **Buka Google Spreadsheet Anda**
2. **Klik `Extensions` → `Apps Script`**
3. **Hapus kode default dan paste kode ini:**
   ```javascript
   function doGet() {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = sheet.getDataRange().getValues();
     
     const headers = data[0];
     const rows = data.slice(1);
     
     const result = rows.map(row => {
       const obj = {};
       headers.forEach((header, index) => {
         obj[header] = row[index] || '';
       });
       return obj;
     });
     
     return ContentService.createTextOutput(JSON.stringify({
       success: true,
       data: result
     })).setMimeType(ContentService.MimeType.JSON);
   }
   ```
4. **Klik `Deploy` → `New deployment`**
5. **Pilih type: `Web app`**
6. **Set Execute as: `Me`**
7. **Set Who has access: `Anyone`**
8. **Klik `Deploy` dan copy URL yang muncul**
9. **Edit file `config.js`:**
   ```javascript
   APPS_SCRIPT_URL: 'PASTE_URL_DISINI'
   ```

### Metode 3: Menggunakan Google Sheets API

1. **Dapatkan API Key:**
   - Buka [Google Cloud Console](https://console.cloud.google.com/)
   - Buat project baru atau pilih project existing
   - Enable Google Sheets API
   - Buat API Key di `Credentials`
   - (Opsional) Restrict API key untuk security
2. **Dapatkan Spreadsheet ID:**
   - Buka URL Google Spreadsheet Anda
   - Copy ID dari URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`
3. **Edit file `config.js`:**
   ```javascript
   SPREADSHEET_ID: 'SPREADSHEET_ID_HERE',
   API_KEY: 'YOUR_API_KEY_HERE',
   SHEET_NAME: 'Sheet1' // Nama sheet Anda
   ```

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

- **Untuk CSV Export:** Spreadsheet harus di-publish sebagai public (setidaknya view-only)
- **Untuk Apps Script:** Deployment harus di-set sebagai `Anyone` untuk bisa diakses tanpa login
- **Untuk API:** Spreadsheet harus di-set sebagai "Anyone with the link can view" jika menggunakan API key tanpa OAuth

## 🐛 Troubleshooting

### Data tidak muncul
- Pastikan spreadsheet sudah di-publish (untuk CSV)
- Pastikan URL di config.js sudah benar
- Cek console browser (F12) untuk error message
- Pastikan CORS enabled (untuk production, gunakan Apps Script)

### Error CORS
- Gunakan Google Apps Script (Metode 2) untuk menghindari CORS issues
- Atau host website di server yang sama dengan domain Google Sheets

### Mobile tidak responsive
- Pastikan viewport meta tag ada di HTML
- Clear cache browser
- Test di device yang berbeda

## 📄 Lisensi

Free to use untuk keperluan pribadi dan komersial.

