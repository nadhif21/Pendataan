# 📘 Panduan Lengkap Google Apps Script untuk BKKBN

Panduan ini akan membantu Anda membuat Google Apps Script untuk mengambil data dari Google Spreadsheet dan menampilkannya di website.

## 🎯 Tujuan

Google Apps Script memungkinkan website mengambil data dari Google Spreadsheet dengan aman dan mudah, tanpa perlu membuat spreadsheet menjadi public atau menggunakan API key yang kompleks.

---

## 📋 Langkah 1: Membuka Google Apps Script

1. **Buka Google Spreadsheet** yang berisi data Anda
2. Klik menu **Extensions** (Ekstensi) → **Apps Script**
3. Akan terbuka tab baru dengan editor Apps Script

---

## 📝 Langkah 2: Menulis Kode Apps Script

### Kode Dasar (Recommended)

Hapus semua kode default dan paste kode berikut:

```javascript
/**
 * Google Apps Script untuk mengambil data dari Spreadsheet
 * 
 * Kode ini akan mengambil semua data dari sheet aktif dan
 * mengembalikannya dalam format JSON
 */

function doGet() {
  try {
    // Ambil spreadsheet aktif
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Ambil sheet aktif (sheet yang sedang dibuka)
    const sheet = spreadsheet.getActiveSheet();
    
    // Atau ambil sheet tertentu berdasarkan nama (uncomment jika perlu)
    // const sheet = spreadsheet.getSheetByName('Sheet1');
    
    // Ambil semua data dari sheet
    const data = sheet.getDataRange().getValues();
    
    // Cek apakah ada data
    if (data.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Tidak ada data di spreadsheet'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Ambil header (baris pertama)
    const headers = data[0];
    
    // Convert data menjadi array of objects
    const result = [];
    for (let i = 1; i < data.length; i++) {
      const row = {};
      headers.forEach((header, index) => {
        // Handle header yang kosong
        const headerName = header || `Kolom${index + 1}`;
        // Ambil nilai, jika kosong gunakan string kosong
        row[headerName] = data[i][index] || '';
      });
      result.push(row);
    }
    
    // Return JSON response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: result,
      total: result.length,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error message
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString(),
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Kode Lanjutan (Dengan Filter)

Jika Anda ingin menambahkan fitur filter berdasarkan query parameter:

```javascript
/**
 * Google Apps Script dengan fitur filter
 * 
 * Contoh penggunaan:
 * ?filter=Nama:John
 * ?category=Baduta
 */

function doGet(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Tidak ada data di spreadsheet'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = data[0];
    let result = [];
    
    // Convert ke array of objects
    for (let i = 1; i < data.length; i++) {
      const row = {};
      headers.forEach((header, index) => {
        const headerName = header || `Kolom${index + 1}`;
        row[headerName] = data[i][index] || '';
      });
      result.push(row);
    }
    
    // Filter berdasarkan query parameter
    if (e && e.parameter) {
      // Filter berdasarkan kolom tertentu
      if (e.parameter.filter) {
        const [key, value] = e.parameter.filter.split(':');
        result = result.filter(item => 
          String(item[key] || '').toLowerCase().includes(value.toLowerCase())
        );
      }
      
      // Filter berdasarkan kategori
      if (e.parameter.category) {
        const category = e.parameter.category.toLowerCase();
        result = result.filter(item => {
          const kategori = String(item['PILIH PERTANYAAN'] || '').toLowerCase();
          if (category === 'baduta') {
            return kategori.includes('baduta') || kategori.includes('balita');
          } else if (category === 'ibu-hamil') {
            return kategori.includes('ibu hamil') || kategori.includes('hamil');
          }
          return true;
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: result,
      total: result.length,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString(),
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 🚀 Langkah 3: Menyimpan dan Memberi Nama Project

1. Klik **File** → **Save** (atau tekan `Ctrl+S` / `Cmd+S`)
2. Beri nama project di bagian atas (misalnya: "BKKBN Data Reader")
3. Klik **Save**

---

## 🔧 Langkah 4: Deploy sebagai Web App

1. Klik tombol **Deploy** → **New deployment**
2. Klik ikon **⚙️** (Settings) di sebelah "Select type"
3. Pilih **Web app**
4. Isi pengaturan:
   - **Description**: (opsional) Beri deskripsi, misalnya "API untuk mengambil data BKKBN"
   - **Execute as**: Pilih **Me** (akun Anda)
   - **Who has access**: Pilih **Anyone** (penting agar website bisa mengakses tanpa login)
5. Klik **Deploy**
6. **PENTING**: Akan muncul popup untuk memberikan akses. Klik **Authorize access**
7. Pilih akun Google Anda
8. Klik **Advanced** → **Go to [Project Name] (unsafe)**
9. Klik **Allow** untuk memberikan izin
10. Setelah deploy berhasil, **COPY URL** yang muncul (format: `https://script.google.com/macros/s/.../exec`)

---

## 📋 Langkah 5: Menggunakan URL di Website

### Untuk Halaman Pendataan (pendataan/config.js)

1. Buka file `pendataan/config.js`
2. Ganti URL di `APPS_SCRIPT_URL` dengan URL yang Anda copy:

```javascript
const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
};
```

### Untuk Halaman BKKBN (assets/bkkbn/bkkbn-config.js)

1. Buka file `assets/bkkbn/bkkbn-config.js`
2. Ganti URL di bagian yang sesuai:

```javascript
const BKKBN_CONFIG = {
    // ... konfigurasi lainnya ...
    
    // URL Apps Script untuk melihat data SUB
    SUB_LIHAT_DATA_URL: 'https://script.google.com/macros/s/YOUR_SUB_SCRIPT_ID/exec',
    
    // URL Apps Script untuk melihat data BKB
    BKB_LIHAT_DATA_URL: 'https://script.google.com/macros/s/YOUR_BKB_SCRIPT_ID/exec'
};
```

---

## ✅ Langkah 6: Testing

1. Buka website Anda
2. Klik tombol "Refresh Data" atau "Melihat Data"
3. Cek apakah data muncul dengan benar
4. Jika ada error, buka **Developer Console** (F12) untuk melihat pesan error

---

## 🔄 Update Kode Apps Script

Jika Anda mengubah kode Apps Script:

1. Edit kode di Apps Script Editor
2. Klik **Deploy** → **Manage deployments**
3. Klik ikon **✏️** (Edit) di deployment yang ada
4. Klik **New version** (untuk membuat versi baru)
5. Klik **Deploy**
6. URL tetap sama, tidak perlu diubah di website

---

## 🎯 Tips dan Best Practices

### 1. Nama Sheet
- Jika spreadsheet Anda memiliki beberapa sheet, gunakan `getSheetByName('NamaSheet')` untuk mengambil sheet tertentu
- Pastikan nama sheet sesuai dengan yang ada di spreadsheet

### 2. Format Data
- Pastikan baris pertama spreadsheet berisi header (nama kolom)
- Hindari baris kosong di tengah data
- Pastikan format data konsisten

### 3. Keamanan
- Apps Script yang di-deploy sebagai "Anyone" bisa diakses oleh siapa saja yang punya URL
- Jangan simpan data sensitif di spreadsheet yang diakses melalui Apps Script
- Pertimbangkan untuk menambahkan autentikasi jika diperlukan

### 4. Performance
- Jika data sangat banyak (ribuan baris), pertimbangkan untuk menambahkan pagination
- Gunakan filter di Apps Script untuk mengurangi data yang dikirim

### 5. Error Handling
- Selalu cek apakah data kosong sebelum memproses
- Handle error dengan baik agar website bisa menampilkan pesan yang jelas

---

## 🐛 Troubleshooting

### Error: "Script function not found: doGet"
- Pastikan fungsi `doGet()` ada di kode Anda
- Pastikan nama fungsi tepat `doGet` (case-sensitive)

### Error: "Access denied" atau "Authorization required"
- Pastikan deployment di-set sebagai "Anyone"
- Pastikan Anda sudah authorize access saat deploy
- Coba deploy ulang dan authorize lagi

### Data tidak muncul di website
- Cek URL Apps Script di config.js sudah benar
- Buka URL Apps Script langsung di browser untuk melihat response
- Cek Developer Console (F12) untuk error message
- Pastikan format response JSON sesuai (ada field `data` atau langsung array)

### Error CORS
- Apps Script seharusnya tidak memiliki masalah CORS
- Jika masih ada error, pastikan deployment sudah benar

### Data kosong
- Pastikan spreadsheet memiliki data
- Pastikan baris pertama adalah header
- Cek apakah sheet yang diambil sudah benar

---

## 📚 Contoh Kode Tambahan

### Mengambil Data dari Sheet Tertentu

```javascript
function doGet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Ambil sheet berdasarkan nama
  const sheet = spreadsheet.getSheetByName('Data TPK');
  
  // ... sisa kode sama
}
```

### Filter Data Berdasarkan Tanggal

```javascript
function doGet(e) {
  // ... kode untuk mengambil data ...
  
  // Filter berdasarkan tanggal
  if (e && e.parameter && e.parameter.date) {
    const filterDate = new Date(e.parameter.date);
    result = result.filter(item => {
      const itemDate = new Date(item['Timestamp']);
      return itemDate.toDateString() === filterDate.toDateString();
    });
  }
  
  // ... return result ...
}
```

### Menambahkan Pagination

```javascript
function doGet(e) {
  // ... kode untuk mengambil data ...
  
  // Pagination
  const page = parseInt(e.parameter.page || '1');
  const limit = parseInt(e.parameter.limit || '50');
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const paginatedData = result.slice(start, end);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: paginatedData,
    total: result.length,
    page: page,
    limit: limit,
    totalPages: Math.ceil(result.length / limit)
  })).setMimeType(ContentService.MimeType.JSON);
}
```

---

## 📞 Bantuan

Jika mengalami masalah:
1. Cek error message di Developer Console (F12)
2. Test URL Apps Script langsung di browser
3. Pastikan semua langkah di atas sudah diikuti dengan benar
4. Cek dokumentasi Google Apps Script: https://developers.google.com/apps-script

---

**Selamat! Anda sudah berhasil membuat Google Apps Script untuk website BKKBN! 🎉**
