// Konfigurasi Google Spreadsheet
// Ganti dengan ID Spreadsheet Anda dan Sheet Name (opsional)

const CONFIG = {
    // Cara 1: Menggunakan Google Sheets API dengan API Key (untuk public sheet)
    // Uncomment dan isi jika menggunakan cara ini
    // SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',
    // API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
    // SHEET_NAME: 'Sheet1', // Nama sheet, bisa dikosongkan untuk sheet pertama
    
    // Cara 2: Menggunakan Published Google Sheet sebagai CSV/JSON (LEBIH MUDAH)
    // Opsi A: Format export langsung (spreadsheet harus di-share publicly)
    // CSV_URL: 'https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/export?format=csv&gid=GID',
    
    // Opsi B: Format published URL (untuk spreadsheet yang sudah di-publish)
    // CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSrvQnWTVJ67404YPH0UJwcZuF7qSahFXkj2YdsZzvSVo9_I8RszRd5F386HYCAuokIzincY8nV6BJB/pub?gid=1983335125&single=true&output=csv',
    
    // Alternatif: Gunakan format export langsung dengan ID spreadsheet
    // Uncomment baris di bawah dan ganti dengan ID spreadsheet Anda jika opsi B tidak bekerja
    // CSV_URL: 'https://docs.google.com/spreadsheets/d/1FVeZEzHe3aOzxh35b0MG_uELO4Msx2nYV33JfsVdWTg/export?format=csv&gid=1983335125',
    
    // Cara 3: Menggunakan Google Apps Script (RECOMMENDED untuk production)
    // Buat Google Apps Script yang mengembalikan JSON, lalu uncomment:
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyhCvaqsW3sVRXH6tNAk_OOyQKKyi2nlR1IAgxn-z2RjgJ1-f8D_skU7_kTMaZOfSX4/exec' // URL ke Google Apps Script Web App
};

