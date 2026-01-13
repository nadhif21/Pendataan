/**
 * CONTOH GOOGLE APPS SCRIPT UNTUK BKKBN
 * 
 * INSTRUKSI:
 * 1. Buka Google Spreadsheet Anda
 * 2. Klik Extensions → Apps Script
 * 3. Copy kode ini ke editor Apps Script
 * 4. Klik Deploy → New deployment → Web app
 * 5. Set "Who has access" menjadi "Anyone"
 * 6. Klik Deploy dan copy URL yang diberikan
 * 7. Paste URL di file config.js (pendataan/config.js atau assets/bkkbn/bkkbn-config.js)
 * 
 * PANDUAN LENGKAP: Lihat docs/APPS_SCRIPT_GUIDE.md
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

/**
 * OPSIONAL: Function untuk filter data berdasarkan query parameter
 * 
 * CATATAN: Function ini tidak digunakan secara default.
 * Jika ingin menggunakan filter, ganti nama function doGet() menjadi doGetWithFilter(e)
 * 
 * Contoh penggunaan:
 * ?filter=Nama:John
 * ?category=Baduta
 */
function doGetWithFilter(e) {
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

