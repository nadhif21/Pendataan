/**
 * CONTOH GOOGLE APPS SCRIPT
 * 
 * Copy kode ini ke Google Apps Script Editor
 * (Extensions → Apps Script di Google Spreadsheet)
 * 
 * Setelah deploy, gunakan URL yang diberikan di config.js
 */

function doGet() {
  try {
    // Ambil spreadsheet aktif
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Atau ambil sheet tertentu berdasarkan nama
    // const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    
    // Ambil semua data
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Tidak ada data'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Ambil header (baris pertama)
    const headers = data[0];
    
    // Convert ke array of objects
    const result = [];
    for (let i = 1; i < data.length; i++) {
      const row = {};
      headers.forEach((header, index) => {
        // Handle header kosong
        const headerName = header || `Column${index + 1}`;
        row[headerName] = data[i][index] || '';
      });
      result.push(row);
    }
    
    // Return JSON
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: result,
      total: result.length
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * OPSIONAL: Function untuk filter data berdasarkan query parameter
 * Contoh: ?filter=Nama:John
 */
function doGetWithFilter(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Tidak ada data'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = data[0];
    let result = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = {};
      headers.forEach((header, index) => {
        const headerName = header || `Column${index + 1}`;
        row[headerName] = data[i][index] || '';
      });
      result.push(row);
    }
    
    // Filter berdasarkan query parameter
    if (e.parameter.filter) {
      const [key, value] = e.parameter.filter.split(':');
      result = result.filter(item => 
        String(item[key]).toLowerCase().includes(value.toLowerCase())
      );
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: result,
      total: result.length
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

