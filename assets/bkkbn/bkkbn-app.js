// Aplikasi BKKBN Kelurahan Way Kandis

// Data menu untuk setiap divisi
const DIVISI_MENU = {
    tpk: {
        icon: '👥',
        title: 'TPK',
        subtitle: 'Tim Penggerak Kelurahan',
        mendataUrl: BKKBN_CONFIG.TPK_MENDATA_URL,
        lihatDataUrl: 'pendataan/index.html'
    },
    sub: {
        icon: '👨‍👩‍👧‍👦',
        title: 'SUB',
        subtitle: 'Sub Tim',
        mendataUrl: BKKBN_CONFIG.SUB_MENDATA_URL,
        lihatDataUrl: BKKBN_CONFIG.SUB_LIHAT_DATA_URL
    },
    bkb: {
        icon: '👶',
        title: 'BKB',
        subtitle: 'Bina Keluarga Balita',
        mendataUrl: BKKBN_CONFIG.BKB_MENDATA_URL,
        lihatDataUrl: BKKBN_CONFIG.BKB_LIHAT_DATA_URL
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const divisiSelect = document.getElementById('divisiSelect');
    
    // Update menu saat pertama kali load
    updateMenu('tpk');
    
    // Update menu saat dropdown berubah
    divisiSelect.addEventListener('change', function() {
        const selectedDivisi = this.value;
        updateMenu(selectedDivisi);
    });
    
    // Validasi dan warning jika link belum dikonfigurasi
    checkConfiguration();
});

// Fungsi untuk mengupdate menu berdasarkan divisi yang dipilih
function updateMenu(divisi) {
    const menuData = DIVISI_MENU[divisi];
    
    if (!menuData) {
        console.error('Divisi tidak ditemukan:', divisi);
        return;
    }
    
    // Update elemen menu
    const menuIcon = document.getElementById('menuIcon');
    const menuTitle = document.getElementById('menuTitle');
    const menuSubtitle = document.getElementById('menuSubtitle');
    const btnMendata = document.getElementById('btnMendata');
    const btnLihatData = document.getElementById('btnLihatData');
    
    // Update konten
    if (menuIcon) menuIcon.textContent = menuData.icon;
    if (menuTitle) menuTitle.textContent = menuData.title;
    if (menuSubtitle) menuSubtitle.textContent = menuData.subtitle;
    
    // Update link Mendata
    if (btnMendata) {
        if (menuData.mendataUrl && !menuData.mendataUrl.includes('YOUR_')) {
            btnMendata.href = menuData.mendataUrl;
            btnMendata.classList.remove('disabled');
        } else {
            btnMendata.href = '#';
            btnMendata.classList.add('disabled');
            btnMendata.onclick = function(e) {
                e.preventDefault();
                alert('Link Google Form untuk divisi ini belum dikonfigurasi. Silakan hubungi administrator.');
            };
        }
    }
    
    // Update link Melihat Data
    if (btnLihatData) {
        if (menuData.lihatDataUrl && menuData.lihatDataUrl !== '#' && !menuData.lihatDataUrl.includes('YOUR_')) {
            btnLihatData.href = menuData.lihatDataUrl;
            btnLihatData.classList.remove('disabled');
            // Hapus event listener sebelumnya jika ada
            btnLihatData.onclick = null;
        } else {
            btnLihatData.href = '#';
            btnLihatData.classList.add('disabled');
            btnLihatData.onclick = function(e) {
                e.preventDefault();
                alert('Fitur Melihat Data untuk divisi ini sedang dalam pengembangan. Mohon tunggu update selanjutnya.');
            };
        }
    }
    
    // Animasi fade untuk transisi
    const menuCard = document.getElementById('menuCard');
    if (menuCard) {
        menuCard.classList.add('updating');
        setTimeout(() => {
            menuCard.classList.remove('updating');
        }, 300);
    }
}

// Fungsi untuk mengecek konfigurasi
function checkConfiguration() {
    const warnings = [];
    
    if (!BKKBN_CONFIG.TPK_MENDATA_URL || BKKBN_CONFIG.TPK_MENDATA_URL.includes('YOUR_')) {
        warnings.push('Link Google Form TPK belum dikonfigurasi');
    }
    
    if (!BKKBN_CONFIG.SUB_MENDATA_URL || BKKBN_CONFIG.SUB_MENDATA_URL.includes('YOUR_')) {
        warnings.push('Link Google Form SUB belum dikonfigurasi');
    }
    
    if (!BKKBN_CONFIG.BKB_MENDATA_URL || BKKBN_CONFIG.BKB_MENDATA_URL.includes('YOUR_')) {
        warnings.push('Link Google Form BKB belum dikonfigurasi');
    }
    
    if (warnings.length > 0) {
        console.warn('⚠️ Konfigurasi belum lengkap:');
        warnings.forEach(warning => console.warn('  - ' + warning));
        console.log('📝 Silakan edit file bkkbn-config.js untuk menambahkan link Google Form');
    }
}
