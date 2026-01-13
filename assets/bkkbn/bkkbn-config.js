// Konfigurasi Link Google Form dan Apps Script untuk BKKBN Kelurahan Way Kandis
//
// CARA MENGGUNAKAN:
// 1. Untuk Google Form: Paste URL Google Form di bagian mendataUrl
// 2. Untuk Melihat Data: Buat Google Apps Script (lihat docs/APPS_SCRIPT_GUIDE.md)
//    lalu paste URL Apps Script di bagian lihatDataUrl
// 3. Setiap divisi bisa memiliki multiple cards, tambahkan object baru di array cards

const BKKBN_CONFIG = {
    // ============================================
    // KONFIGURASI CARDS PER DIVISI
    // ============================================
    
    tpk: {
        icon: '👥',
        title: 'TPK',
        subtitle: 'Tim Pendamping Keluarga',
        cards: [
            {
                id: 'pendampingan-kelompok',
                title: 'Jumlah Pendampingan Kelompok Sasaran',
                mendataUrl: 'https://forms.gle/F56XTnWVBZ8CwhGQ6',
                lihatDataUrl: 'tpk/index.html'
            },
            {
                id: 'data-keluarga',
                title: 'Data Keluarga Binaan TPK',
                mendataUrl: 'https://forms.gle/YOUR_TPK_FORM_LINK_HERE',
                lihatDataUrl: 'https://script.google.com/macros/s/YOUR_TPK_APPS_SCRIPT_ID/exec'
            }
            // Tambahkan card lain untuk TPK di sini
        ]
    },
    
    sub: {
        icon: '👨‍👩‍👧‍👦',
        title: 'SUB',
        subtitle: 'Sub Tim',
        cards: [
            {
                id: 'data-akseptor',
                title: 'Data Akseptor Sub PPKBD Kelurahan Way Kandis',
                mendataUrl: 'https://forms.gle/Wnfik3Qcxtq7pHxP7',
                lihatDataUrl: 'sub/index.html'
            },
            {
                id: 'kunjungan-rumah',
                title: 'Data Kunjungan Rumah Sub PPKBD',
                mendataUrl: 'https://forms.gle/YOUR_SUB_FORM_LINK_HERE',
                lihatDataUrl: 'https://script.google.com/macros/s/YOUR_SUB_APPS_SCRIPT_ID/exec'
            }
            // Tambahkan card lain untuk SUB di sini
        ]
    },
    
    bkb: {
        icon: '👶',
        title: 'BKB',
        subtitle: 'Bina Keluarga Balita',
        cards: [
            {
                id: 'data-bkb',
                title: 'Data BKB',
                mendataUrl: 'https://forms.gle/YOUR_BKB_FORM_LINK_HERE',
                lihatDataUrl: 'https://script.google.com/macros/s/YOUR_BKB_APPS_SCRIPT_ID/exec'
            },
            {
                id: 'kegiatan-bkb',
                title: 'Data Kegiatan BKB Kelurahan Way Kandis',
                mendataUrl: 'https://forms.gle/YOUR_BKB_FORM_LINK_HERE',
                lihatDataUrl: 'https://script.google.com/macros/s/YOUR_BKB_APPS_SCRIPT_ID/exec'
            }
            // Tambahkan card lain untuk BKB di sini
        ]
    }
};
