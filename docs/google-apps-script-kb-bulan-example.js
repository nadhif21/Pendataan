/**
 * CONTOH GOOGLE APPS SCRIPT UNTUK KESERTAAN KB/BULAN
 * 
 * INSTRUKSI:
 * 1. Buka Google Spreadsheet KESERTAAN KB/BULAN Anda
 * 2. Klik Extensions → Apps Script
 * 3. Copy kode ini ke editor Apps Script
 * 4. Klik Deploy → New deployment → Web app
 * 5. Set "Who has access" menjadi "Anyone"
 * 6. Set "Execute as" menjadi "Me"
 * 7. Klik Deploy dan copy URL yang diberikan
 * 8. Paste URL di file sub/kb-bulan-config.js (untuk APPS_SCRIPT_URL dan UPDATE_SCRIPT_URL)
 */

// Fungsi untuk membaca data (GET) atau update data (GET dengan parameter)
function doGet(e) {
  try {
    // Cek apakah ada parameter untuk update
    const action = e.parameter.action;
    
    if (action === 'update') {
      // Handle update via GET
      const row = parseInt(e.parameter.row);
      const column = e.parameter.column;
      const value = e.parameter.value;
      
      if (!row || !column || value === undefined) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'Parameter tidak lengkap'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Ambil spreadsheet aktif
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = spreadsheet.getActiveSheet();
      
      // Ambil header untuk mencari index kolom
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      // Cari kolom dengan case-insensitive dan trim
      let columnIndex = -1;
      const columnUpper = String(column).toUpperCase().trim();
      
      for (let i = 0; i < headers.length; i++) {
        const headerUpper = String(headers[i] || '').toUpperCase().trim();
        if (headerUpper === columnUpper) {
          columnIndex = i + 1; // +1 karena index dimulai dari 1 di Sheets
          break;
        }
      }
      
      if (columnIndex === -1) {
        // Jika tidak ditemukan exact match, coba partial match
        for (let i = 0; i < headers.length; i++) {
          const headerUpper = String(headers[i] || '').toUpperCase().trim();
          if (headerUpper.includes(columnUpper) || columnUpper.includes(headerUpper)) {
            columnIndex = i + 1;
            break;
          }
        }
      }
      
      if (columnIndex === -1) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'Kolom tidak ditemukan: ' + column + '. Headers yang tersedia: ' + headers.join(', ')
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Update nilai di spreadsheet
      sheet.getRange(row, columnIndex).setValue(value);
      
      // Log untuk debugging (opsional, bisa dihapus setelah testing)
      Logger.log('Updated: Row ' + row + ', Column ' + columnIndex + ' (' + column + '), Value: ' + value);
      
      // Return success response
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Data berhasil diupdate',
        row: row,
        column: column,
        value: value,
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Jika tidak ada action atau action bukan update, baca data
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

// Fungsi untuk mengupdate data (POST)
function doPost(e) {
  try {
    // Parse request body
    const requestData = JSON.parse(e.postData.contents);
    
    // Validasi action
    if (requestData.action !== 'update') {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Action tidak valid'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Ambil spreadsheet aktif
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Ambil header untuk mencari index kolom
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Cari kolom dengan case-insensitive dan trim (sama seperti di doGet)
    let columnIndex = -1;
    const columnUpper = String(requestData.column).toUpperCase().trim();
    
    for (let i = 0; i < headers.length; i++) {
      const headerUpper = String(headers[i] || '').toUpperCase().trim();
      if (headerUpper === columnUpper) {
        columnIndex = i + 1; // +1 karena index dimulai dari 1 di Sheets
        break;
      }
    }
    
    if (columnIndex === -1) {
      // Jika tidak ditemukan exact match, coba partial match
      for (let i = 0; i < headers.length; i++) {
        const headerUpper = String(headers[i] || '').toUpperCase().trim();
        if (headerUpper.includes(columnUpper) || columnUpper.includes(headerUpper)) {
          columnIndex = i + 1;
          break;
        }
      }
    }
    
    if (columnIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Kolom tidak ditemukan: ' + requestData.column + '. Headers yang tersedia: ' + headers.join(', ')
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Update nilai di spreadsheet
    // requestData.row adalah nomor baris (1-based, termasuk header)
    sheet.getRange(requestData.row, columnIndex).setValue(requestData.value);
    
    // Log untuk debugging
    Logger.log('POST Updated: Row ' + requestData.row + ', Column ' + columnIndex + ' (' + requestData.column + '), Value: ' + requestData.value);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data berhasil diupdate',
      row: requestData.row,
      column: requestData.column,
      columnIndex: columnIndex,
      value: requestData.value,
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
