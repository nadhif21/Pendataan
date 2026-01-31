// Konfigurasi Google Spreadsheet menggunakan Google Apps Script untuk KESERTAAN KB/BULAN
// 
// CARA MENGGUNAKAN:
// 1. Buat Google Apps Script di spreadsheet KESERTAAN KB/BULAN (lihat contoh di docs/google-apps-script-example.js)
// 2. Deploy sebagai Web App dan dapatkan URL
// 3. Paste URL di bawah ini

const CONFIG = {
    // URL Google Apps Script Web App untuk KESERTAAN KB/BULAN
    // Format: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
    // 
    // INSTRUKSI:
    // - Ganti URL di bawah dengan URL Apps Script KESERTAAN KB/BULAN Anda
    // - Pastikan Apps Script sudah di-deploy sebagai Web App dengan akses "Anyone"
    // - Lihat contoh script di: docs/google-apps-script-example.js
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyFSCj76Rdl0BBZCDRCUh582YKNCbbWLH4Xt5hoqdeAK5GHCek_JSCLiH7XQ-1fLoQP/exec',
    
    // URL untuk update data (bisa sama dengan APPS_SCRIPT_URL jika menggunakan doPost)
    UPDATE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyFSCj76Rdl0BBZCDRCUh582YKNCbbWLH4Xt5hoqdeAK5GHCek_JSCLiH7XQ-1fLoQP/exec'
};
