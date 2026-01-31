// Aplikasi untuk Input KESERTAAN KB/BULAN

let currentData = []; // Data asli dari spreadsheet (termasuk blank)
let filteredData = []; // Data yang sudah di-filter untuk ditampilkan
let currentRowIndex = -1; // Index di currentData (data asli)
let currentRowData = null;

// Mapping nama bulan untuk display
const bulanMapping = {
    'JAN': 'Januari',
    'FEB': 'Februari',
    'MAR': 'Maret',
    'APR': 'April',
    'MEI': 'Mei',
    'JUN': 'Juni',
    'JUL': 'Juli',
    'AGS': 'Agustus',
    'SEP': 'September',
    'OKT': 'Oktober',
    'NOV': 'November',
    'DES': 'Desember'
};

// Mapping jenis KB untuk display (nama lengkap)
const jenisKBMapping = {
    'IUD (I)': 'IUD',
    'MOW (OW)': 'MOW',
    'MOP (OP)': 'MOP',
    'IMPLAN (IP)': 'IMPLAN',
    'SUNTIK (S)': 'SUNTIK',
    'PIL (P)': 'PIL',
    'KONDOM (K)': 'KONDOM'
};

// Initialize aplikasi
document.addEventListener('DOMContentLoaded', function() {
    const refreshBtn = document.getElementById('refreshBtn');
    const kaderSelect = document.getElementById('kaderSelect');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const modal = document.getElementById('inputModal');
    const closeBtn = document.querySelector('.close');
    const inputForm = document.getElementById('inputForm');
    const statusKBRadios = document.querySelectorAll('input[name="statusKB"]');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadData);
    }
    
    if (kaderSelect) {
        kaderSelect.addEventListener('change', applyFilters);
    }
    
    // Setup search functionality
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearSearch);
    }
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Handle status KB change
    statusKBRadios.forEach(radio => {
        radio.addEventListener('change', handleStatusKBChange);
    });
    
    // Handle form submit
    inputForm.addEventListener('submit', handleFormSubmit);
    
    // Auto-load data saat page terbuka
    loadData();
});

// Fungsi untuk mengambil data dari Google Spreadsheet
async function loadData() {
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    const dataContainer = document.getElementById('dataContainer');
    const refreshBtn = document.getElementById('refreshBtn');
    
    // Show loading
    if (loading) loading.style.display = 'flex';
    if (errorMessage) errorMessage.style.display = 'none';
    if (refreshBtn) refreshBtn.disabled = true;
    
    try {
        // Cek konfigurasi Apps Script
        if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL.includes('YOUR_')) {
            throw new Error('Silakan konfigurasi APPS_SCRIPT_URL di file kb-bulan-config.js');
        }
        
        // Menggunakan Google Apps Script
        const allData = await loadFromAppsScript();
        
        if (!allData || allData.length === 0) {
            showError('Tidak ada data ditemukan');
            return;
        }
        
        // Simpan semua data asli (termasuk blank) untuk referensi row index
        currentData = allData;
        
        // Filter data yang blank hanya untuk ditampilkan
        // Baris dianggap blank jika semua kolom penting kosong
        const nonBlankData = allData.filter(row => {
            // Daftar kolom yang harus dicek (kolom penting)
            const importantColumns = ['Nama KK', 'Nama kk', 'Nama Istri', 'Nama istri', 
                                     'Tanggal Lahir Istri', 'Tanggal lahir istri',
                                     'Nama kader', 'Nama Kader'];
            
            // Cek apakah ada setidaknya satu kolom penting yang memiliki nilai
            let hasImportantData = false;
            
            // Cek kolom penting dulu
            for (const col of importantColumns) {
                const value = row[col] || findValueByPartialKey(row, col.toLowerCase());
                if (value) {
                    const stringValue = String(value).trim();
                    if (stringValue.length > 0 && stringValue !== 'undefined' && stringValue !== 'null') {
                        hasImportantData = true;
                        break;
                    }
                }
            }
            
            // Jika kolom penting kosong, cek semua kolom sebagai fallback
            if (!hasImportantData) {
                hasImportantData = Object.values(row).some(value => {
                    if (value === null || value === undefined) return false;
                    const stringValue = String(value).trim();
                    // Abaikan nilai yang hanya spasi, undefined, null, atau string kosong
                    return stringValue.length > 0 && 
                           stringValue !== 'undefined' && 
                           stringValue !== 'null' &&
                           stringValue !== 'NaN';
                });
            }
            
            return hasImportantData;
        });
        
        if (nonBlankData.length === 0) {
            showError('Tidak ada data ditemukan setelah filter');
            return;
        }
        
        filteredData = nonBlankData;
        
        // Apply filters dan tampilkan tabel
        applyFilters();
        if (dataContainer) dataContainer.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading data:', error);
        showError(error.message || 'Terjadi kesalahan saat memuat data. Pastikan Apps Script sudah di-deploy dengan benar.');
    } finally {
        if (loading) loading.style.display = 'none';
        if (refreshBtn) refreshBtn.disabled = false;
    }
}

// Mengambil data dari Google Apps Script
async function loadFromAppsScript() {
    const response = await fetch(CONFIG.APPS_SCRIPT_URL);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. Pastikan Apps Script sudah di-deploy dengan benar.`);
    }
    
    const json = await response.json();
    
    // Handle response format dari Apps Script
    if (json.success === false) {
        throw new Error(json.message || 'Gagal mengambil data dari Apps Script');
    }
    
    // Return data (bisa dalam format {data: [...]} atau langsung array)
    return json.data || json;
}


// Fungsi untuk highlight text
function highlightText(text, searchTerm) {
    if (!searchTerm || searchTerm.length === 0) {
        return text;
    }
    
    const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
    return String(text).replace(regex, '<mark>$1</mark>');
}

// Escape regex special characters
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Menampilkan data ke tabel
function displayData(data, searchTerm = '') {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    const emptyState = document.getElementById('emptyState');
    const kaderSelect = document.getElementById('kaderSelect');
    
    if (data.length === 0) {
        if (tableBody) tableBody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    // Get semua headers dari data pertama
    const allHeaders = Object.keys(data[0]);
    
    // Tentukan apakah harus menampilkan kolom Nama Kader
    const selectedKader = kaderSelect ? kaderSelect.value : '';
    const showKaderColumn = selectedKader === '';
    
    // Filter kolom yang relevan
    let relevantHeaders = allHeaders.filter(header => {
        const headerLower = String(header).toLowerCase().trim();
        const headerUpper = String(header).toUpperCase().trim();
        const headerOriginal = String(header).trim();
        
        // Exclude timestamp
        if (headerLower.includes('timestamp')) {
            return false;
        }
        
        // Exclude kolom kategori umur individual
        if (headerUpper.includes('<20') || headerUpper.includes('&LT;20') || headerOriginal.includes('<20')) {
            return false;
        }
        if (headerUpper.includes('20-30') || headerUpper.includes('20 30') || headerOriginal.includes('20-30')) {
            return false;
        }
        // Exclude kolom > 30 TH dengan berbagai variasi
        if (headerUpper.includes('>30') || 
            headerUpper.includes('&GT;30') || 
            headerUpper.includes('> 30') ||
            headerOriginal.includes('> 30 TH') ||
            headerOriginal.includes('>30 TH') ||
            headerOriginal.includes('> 30TH') ||
            headerOriginal === '> 30 TH' ||
            headerOriginal === '>30 TH' ||
            headerOriginal === '> 30TH') {
            return false;
        }
        
        // Exclude kolom penyuluhan dan keterangan
        if (headerLower.includes('penyuluhan') || headerLower.includes('keterangan')) {
            return false;
        }
        
        return true;
    });
    
    // Jika tidak show kader column, hapus dari headers
    if (!showKaderColumn) {
        relevantHeaders = relevantHeaders.filter(header => {
            const headerLower = String(header).toLowerCase().trim();
            return !headerLower.includes('kader');
        });
    } else {
        // Jika show kader, pastikan di posisi pertama
        const kaderHeader = relevantHeaders.find(h => String(h).toLowerCase().includes('kader'));
        if (kaderHeader) {
            relevantHeaders = relevantHeaders.filter(h => h !== kaderHeader);
            relevantHeaders.unshift(kaderHeader);
        }
    }
    
    // Pastikan kolom "ALASAN TIDAK KB" ada di headers
    const alasanHeader = relevantHeaders.find(h => String(h).toLowerCase().includes('alasan'));
    if (!alasanHeader) {
        // Cari di allHeaders jika ada
        const alasanFromAll = allHeaders.find(h => String(h).toLowerCase().includes('alasan'));
        if (alasanFromAll) {
            relevantHeaders.push(alasanFromAll);
        } else {
            relevantHeaders.push('ALASAN TIDAK KB');
        }
    }
    
    // Create header row
    if (tableHeader) {
        tableHeader.innerHTML = '';
        relevantHeaders.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            tableHeader.appendChild(th);
        });
    }
    
    // Create data rows
    if (tableBody) {
        tableBody.innerHTML = '';
        data.forEach((row, rowIndex) => {
            // Double check: skip baris yang benar-benar kosong
            const hasData = relevantHeaders.some(header => {
                const value = row[header] || '';
                const stringValue = String(value).trim();
                return stringValue.length > 0 && 
                       stringValue !== 'undefined' && 
                       stringValue !== 'null';
            });
            
            // Jika baris kosong, skip
            if (!hasData) {
                return;
            }
            
            const tr = document.createElement('tr');
            tr.setAttribute('data-row-index', rowIndex);
            tr.addEventListener('click', () => openInputModal(row, rowIndex));
            
            relevantHeaders.forEach(header => {
                const td = document.createElement('td');
                let cellValue = row[header] || '';
                
                // Format khusus untuk kolom bulan yang sudah terisi
                if (isBulanColumn(header) && cellValue) {
                    cellValue = formatKBValue(cellValue);
                }
                
                const valueSpan = document.createElement('span');
                valueSpan.className = 'cell-value';
                // Highlight jika ada search term
                if (searchTerm && searchTerm.length > 0) {
                    valueSpan.innerHTML = highlightText(cellValue, searchTerm);
                } else {
                    valueSpan.textContent = cellValue;
                }
                td.appendChild(valueSpan);
                td.setAttribute('data-label', header);
                tr.appendChild(td);
            });
            
            tableBody.appendChild(tr);
        });
    }
}

// Cek apakah kolom adalah kolom bulan
function isBulanColumn(header) {
    const bulanColumns = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGS', 'SEP', 'OKT', 'NOV', 'DES'];
    return bulanColumns.some(bulan => header.toUpperCase().includes(bulan));
}

// Format nilai KB untuk display
function formatKBValue(value) {
    const valueStr = String(value).trim();
    
    // Jika mengandung kode jenis KB, tampilkan nama lengkap
    for (const [key, displayName] of Object.entries(jenisKBMapping)) {
        if (valueStr.includes(key) || valueStr === key.split(' ')[0]) {
            return displayName;
        }
    }
    
    // Jika alasan tidak KB (kecuali HAMIL), tampilkan kode saja
    if (valueStr === 'HAMIL') {
        return 'HAMIL';
    }
    if (valueStr.includes('IAS') || valueStr === 'IAS') {
        return 'IAS';
    }
    if (valueStr.includes('IAT') || valueStr === 'IAT') {
        return 'IAT';
    }
    if (valueStr.includes('TIA') || valueStr === 'TIA') {
        return 'TIA';
    }
    
    return valueStr;
}

// Apply filters (kader + search)
function applyFilters() {
    const kaderSelect = document.getElementById('kaderSelect');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    const selectedKader = kaderSelect ? kaderSelect.value : '';
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    // Show/hide clear button
    if (clearSearchBtn) {
        if (searchTerm.length > 0) {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
        }
    }
    
    // Filter data berdasarkan kader
    let tempFiltered = currentData;
    if (selectedKader) {
        tempFiltered = tempFiltered.filter(row => {
            const kaderValue = String(row['Nama kader'] || row['Nama Kader'] || findValueByPartialKey(row, 'kader') || '').trim();
            return kaderValue.toLowerCase() === selectedKader.toLowerCase();
        });
    }
    
    // Filter data berdasarkan search term
    if (searchTerm.length > 0) {
        filteredData = tempFiltered.filter(row => {
            return Object.values(row).some(value => {
                const stringValue = String(value || '').toLowerCase();
                return stringValue.includes(searchTerm);
            });
        });
    } else {
        filteredData = tempFiltered;
    }
    
    // Display filtered data
    if (filteredData.length === 0) {
        const tableBody = document.getElementById('tableBody');
        const emptyState = document.getElementById('emptyState');
        if (tableBody) tableBody.innerHTML = '';
        if (emptyState) {
            emptyState.innerHTML = '<p>🔍 Tidak ada data yang cocok dengan filter yang dipilih</p>';
            emptyState.style.display = 'block';
        }
    } else {
        displayData(filteredData, searchTerm);
        updateResultCount(filteredData.length, currentData.length);
    }
}

// Handle search input
function handleSearch() {
    applyFilters();
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.value = '';
    }
    if (clearSearchBtn) {
        clearSearchBtn.style.display = 'none';
    }
    
    applyFilters();
}

// Update result count
function updateResultCount(filtered, total) {
    const resultCount = document.getElementById('resultCount');
    if (resultCount) {
        if (filtered === total) {
            resultCount.textContent = `Menampilkan ${total} data`;
        } else {
            resultCount.textContent = `Menampilkan ${filtered} dari ${total} data`;
        }
    }
}

// Buka modal input
function openInputModal(rowData, rowIndex) {
    currentRowData = rowData;
    // rowIndex adalah index dari filteredData, perlu cari index di currentData (data asli dari spreadsheet)
    // Cari row yang sama di currentData berdasarkan beberapa field unik untuk mendapatkan row index asli
    const actualRowIndex = currentData.findIndex(row => {
        // Bandingkan beberapa field untuk memastikan row yang sama
        const namaKK1 = String(row['Nama KK'] || row['Nama kk'] || findValueByPartialKey(row, 'nama kk') || '').trim();
        const namaKK2 = String(rowData['Nama KK'] || rowData['Nama kk'] || findValueByPartialKey(rowData, 'nama kk') || '').trim();
        
        const namaIstri1 = String(row['Nama Istri'] || row['Nama istri'] || findValueByPartialKey(row, 'nama istri') || '').trim();
        const namaIstri2 = String(rowData['Nama Istri'] || rowData['Nama istri'] || findValueByPartialKey(rowData, 'nama istri') || '').trim();
        
        const tglLahir1 = String(row['Tanggal Lahir Istri'] || findValueByPartialKey(row, 'tanggal lahir') || '').trim();
        const tglLahir2 = String(rowData['Tanggal Lahir Istri'] || findValueByPartialKey(rowData, 'tanggal lahir') || '').trim();
        
        return namaKK1 === namaKK2 && namaIstri1 === namaIstri2 && tglLahir1 === tglLahir2;
    });
    
    // Gunakan actualRowIndex jika ditemukan (ini adalah index di currentData = data asli dari spreadsheet)
    if (actualRowIndex >= 0) {
        currentRowIndex = actualRowIndex;
    } else {
        // Jika tidak ditemukan, coba cari berdasarkan index filteredData
        // Tapi ini kurang akurat, jadi kita coba cari lagi dengan lebih teliti
        console.warn('Row tidak ditemukan di currentData, menggunakan rowIndex dari filteredData:', rowIndex);
        currentRowIndex = rowIndex;
    }
    
    console.log('Modal opened:', {
        filteredIndex: rowIndex,
        actualIndex: actualRowIndex,
        currentRowIndex: currentRowIndex,
        rowData: rowData
    });
    
    const modal = document.getElementById('inputModal');
    const namaKader = document.getElementById('namaKader');
    const namaKK = document.getElementById('namaKK');
    const namaIstri = document.getElementById('namaIstri');
    const tanggalLahir = document.getElementById('tanggalLahir');
    const umurIstri = document.getElementById('umurIstri');
    const bulanSelect = document.getElementById('bulanSelect');
    const statusKBRadios = document.querySelectorAll('input[name="statusKB"]');
    const jenisKBSelect = document.getElementById('jenisKBSelect');
    const alasanTidakKBSelect = document.getElementById('alasanTidakKBSelect');
    
    // Isi data - cari dengan berbagai variasi nama kolom
    const namaKaderValue = rowData['Nama kader'] || rowData['Nama Kader'] || findValueByPartialKey(rowData, 'kader') || '';
    const namaKKValue = rowData['Nama KK'] || findValueByPartialKey(rowData, 'nama kk') || '';
    const namaIstriValue = rowData['Nama Istri'] || findValueByPartialKey(rowData, 'nama istri') || '';
    const tanggalLahirValue = rowData['Tanggal Lahir Istri'] || findValueByPartialKey(rowData, 'tanggal lahir') || '';
    const umurIstriValue = rowData['Umur Istri'] || findValueByPartialKey(rowData, 'umur istri') || '';
    
    if (namaKader) namaKader.value = namaKaderValue;
    if (namaKK) namaKK.value = namaKKValue;
    if (namaIstri) namaIstri.value = namaIstriValue;
    if (tanggalLahir) tanggalLahir.value = tanggalLahirValue;
    if (umurIstri) umurIstri.value = umurIstriValue;
    
    // Reset form
    statusKBRadios.forEach(radio => radio.checked = false);
    if (bulanSelect) bulanSelect.value = '';
    if (jenisKBSelect) jenisKBSelect.value = '';
    if (alasanTidakKBSelect) alasanTidakKBSelect.value = '';
    document.getElementById('bulanGroup').style.display = 'none';
    document.getElementById('jenisKBGroup').style.display = 'none';
    document.getElementById('alasanTidakKBGroup').style.display = 'none';
    
    // Tampilkan modal
    if (modal) modal.style.display = 'block';
}

// Tutup modal
function closeModal() {
    const modal = document.getElementById('inputModal');
    if (modal) modal.style.display = 'none';
    currentRowData = null;
    currentRowIndex = -1;
}

// Handle perubahan status KB
function handleStatusKBChange() {
    const statusKB = document.querySelector('input[name="statusKB"]:checked')?.value;
    const bulanGroup = document.getElementById('bulanGroup');
    const jenisKBGroup = document.getElementById('jenisKBGroup');
    const alasanTidakKBGroup = document.getElementById('alasanTidakKBGroup');
    const bulanSelect = document.getElementById('bulanSelect');
    const jenisKBSelect = document.getElementById('jenisKBSelect');
    const alasanTidakKBSelect = document.getElementById('alasanTidakKBSelect');
    
    if (statusKB === 'KB') {
        // Jika KB: tampilkan bulan dan jenis KB
        if (bulanGroup) bulanGroup.style.display = 'block';
        if (jenisKBGroup) jenisKBGroup.style.display = 'block';
        if (alasanTidakKBGroup) alasanTidakKBGroup.style.display = 'none';
        if (bulanSelect) bulanSelect.required = true;
        if (jenisKBSelect) jenisKBSelect.required = true;
        if (alasanTidakKBSelect) alasanTidakKBSelect.required = false;
        if (alasanTidakKBSelect) alasanTidakKBSelect.value = '';
    } else if (statusKB === 'TIDAK KB') {
        // Jika TIDAK KB: hanya tampilkan alasan (tanpa bulan)
        if (bulanGroup) bulanGroup.style.display = 'none';
        if (jenisKBGroup) jenisKBGroup.style.display = 'none';
        if (alasanTidakKBGroup) alasanTidakKBGroup.style.display = 'block';
        if (bulanSelect) bulanSelect.required = false;
        if (jenisKBSelect) jenisKBSelect.required = false;
        if (alasanTidakKBSelect) alasanTidakKBSelect.required = true;
        if (bulanSelect) bulanSelect.value = '';
        if (jenisKBSelect) jenisKBSelect.value = '';
    } else {
        // Reset semua jika tidak ada pilihan
        if (bulanGroup) bulanGroup.style.display = 'none';
        if (jenisKBGroup) jenisKBGroup.style.display = 'none';
        if (alasanTidakKBGroup) alasanTidakKBGroup.style.display = 'none';
        if (bulanSelect) bulanSelect.required = false;
        if (jenisKBSelect) jenisKBSelect.required = false;
        if (alasanTidakKBSelect) alasanTidakKBSelect.required = false;
    }
}

// Handle form submit
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const bulanSelect = document.getElementById('bulanSelect');
    const statusKB = document.querySelector('input[name="statusKB"]:checked')?.value;
    const jenisKBSelect = document.getElementById('jenisKBSelect');
    const alasanTidakKBSelect = document.getElementById('alasanTidakKBSelect');
    
    // Validasi
    if (!statusKB) {
        alert('Silakan pilih status KB terlebih dahulu');
        return;
    }
    
    if (statusKB === 'KB') {
        // Validasi untuk KB: butuh bulan dan jenis KB
        if (!bulanSelect || !bulanSelect.value) {
            alert('Silakan pilih bulan');
            return;
        }
        if (!jenisKBSelect || !jenisKBSelect.value) {
            alert('Silakan pilih jenis KB');
            return;
        }
    } else if (statusKB === 'TIDAK KB') {
        // Validasi untuk TIDAK KB: hanya butuh alasan (tidak perlu bulan)
        if (!alasanTidakKBSelect || !alasanTidakKBSelect.value) {
            alert('Silakan pilih alasan tidak KB');
            return;
        }
    }
    
    // Siapkan data untuk dikirim
    let valueToSave = '';
    let columnToUpdate = '';
    
    if (statusKB === 'KB') {
        // Untuk KB, simpan nama lengkap (IUD, MOW, dll) di kolom bulan
        const selectedJenisKB = jenisKBSelect.value;
        valueToSave = jenisKBMapping[selectedJenisKB] || selectedJenisKB.split(' ')[0];
        columnToUpdate = bulanSelect.value;
    } else {
        // Untuk TIDAK KB, simpan di kolom "ALASAN TIDAK KB"
        const selectedAlasan = alasanTidakKBSelect.value;
        if (selectedAlasan === 'HAMIL') {
            valueToSave = 'HAMIL';
        } else {
            valueToSave = selectedAlasan; // IAS, IAT, TIA
        }
        // Cari kolom "ALASAN TIDAK KB"
        const allHeaders = Object.keys(currentData[0] || {});
        const alasanColumn = allHeaders.find(header => 
            String(header).toLowerCase().includes('alasan')
        );
        columnToUpdate = alasanColumn || 'ALASAN TIDAK KB';
    }
    
    // Disable submit button
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Menyimpan...';
    }
    
    try {
        // Hitung row index yang benar untuk spreadsheet
        // currentRowIndex adalah index di currentData (data asli dari spreadsheet, 0-based)
        // Spreadsheet: row 1 = header, row 2 = data pertama (index 0 di currentData)
        // Jadi row di spreadsheet = currentRowIndex + 2
        const spreadsheetRowIndex = currentRowIndex + 2;
        
        console.log('Updating spreadsheet:', {
            currentRowIndex: currentRowIndex,
            spreadsheetRowIndex: spreadsheetRowIndex,
            column: columnToUpdate,
            value: valueToSave,
            namaKK: currentRowData ? (currentRowData['Nama KK'] || findValueByPartialKey(currentRowData, 'nama kk')) : 'N/A',
            namaIstri: currentRowData ? (currentRowData['Nama Istri'] || findValueByPartialKey(currentRowData, 'nama istri')) : 'N/A'
        });
        
        // Update data ke spreadsheet
        const result = await updateDataToSpreadsheet(
            spreadsheetRowIndex,
            columnToUpdate,
            valueToSave
        );
        
        console.log('Update result:', result);
        
        // Update data lokal
        if (currentRowData && currentRowIndex >= 0) {
            // Cari nama kolom yang tepat
            const allHeaders = Object.keys(currentData[0] || {});
            const matchedColumn = allHeaders.find(header => 
                String(header).toUpperCase().trim() === columnToUpdate.toUpperCase().trim()
            );
            
            if (matchedColumn) {
                currentRowData[matchedColumn] = valueToSave;
                // Update juga di currentData untuk row yang sesuai
                const actualRowIndex = currentData.findIndex(row => row === currentRowData);
                if (actualRowIndex >= 0) {
                    currentData[actualRowIndex][matchedColumn] = valueToSave;
                }
            } else {
                // Jika tidak ditemukan, coba langsung dengan nama kolom
                currentRowData[columnToUpdate] = valueToSave;
            }
        }
        
        // Refresh tabel dengan filter yang aktif
        applyFilters();
        
        // Tutup modal
        closeModal();
        
        alert('Data berhasil disimpan!');
        
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Gagal menyimpan data: ' + error.message);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    }
}

// Update data ke spreadsheet
async function updateDataToSpreadsheet(rowIndex, bulanColumn, value) {
    // Cek konfigurasi
    if (!CONFIG.UPDATE_SCRIPT_URL || CONFIG.UPDATE_SCRIPT_URL.includes('YOUR_')) {
        throw new Error('Silakan konfigurasi UPDATE_SCRIPT_URL di file kb-bulan-config.js');
    }
    
    // Cari nama kolom yang tepat dari headers
    const allHeaders = Object.keys(currentData[0] || {});
    let columnName = bulanColumn;
    
    // Cari kolom yang cocok dengan bulanColumn (case insensitive)
    const matchedColumn = allHeaders.find(header => 
        String(header).toUpperCase().trim() === bulanColumn.toUpperCase().trim()
    );
    
    if (matchedColumn) {
        columnName = matchedColumn;
    }
    
    // Kirim data ke Apps Script
    // Google Apps Script Web App biasanya lebih baik menggunakan method GET untuk menghindari CORS
    try {
        // Coba dengan method GET dulu (lebih kompatibel dengan Google Apps Script)
        const getUrl = `${CONFIG.UPDATE_SCRIPT_URL}?action=update&row=${rowIndex}&column=${encodeURIComponent(columnName)}&value=${encodeURIComponent(value)}`;
        
        const getResponse = await fetch(getUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (getResponse.ok) {
            const json = await getResponse.json();
            if (json.success === false) {
                throw new Error(json.message || 'Gagal mengupdate data');
            }
            return json;
        } else {
            throw new Error(`HTTP error! status: ${getResponse.status}`);
        }
        
    } catch (getError) {
        // Jika GET gagal, coba POST dengan JSON
        try {
            const postResponse = await fetch(CONFIG.UPDATE_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'update',
                    row: rowIndex,
                    column: columnName,
                    value: value
                })
            });
            
            if (!postResponse.ok) {
                const errorText = await postResponse.text();
                throw new Error(`HTTP error! status: ${postResponse.status}. ${errorText}`);
            }
            
            const json = await postResponse.json();
            
            if (json.success === false) {
                throw new Error(json.message || 'Gagal mengupdate data');
            }
            
            return json;
            
        } catch (postError) {
            // Jika kedua method gagal, beri pesan error yang jelas
            if (getError.message.includes('Failed to fetch') || getError.message.includes('NetworkError') || 
                postError.message.includes('Failed to fetch') || postError.message.includes('NetworkError') ||
                getError.message.includes('CORS') || postError.message.includes('CORS')) {
                throw new Error('Tidak dapat terhubung ke server. Pastikan:\n1. UPDATE_SCRIPT_URL sudah dikonfigurasi dengan benar di kb-bulan-config.js\n2. Google Apps Script sudah di-deploy sebagai Web App\n3. Akses Web App diset ke "Anyone"\n4. Web App menggunakan "Execute as: Me" dan "Who has access: Anyone"\n5. Pastikan Apps Script memiliki fungsi doGet() dan doPost() untuk handle request');
            }
            throw postError;
        }
    }
}

// Helper function untuk mencari value berdasarkan partial key
function findValueByPartialKey(obj, searchKey) {
    const searchKeyLower = searchKey.toLowerCase();
    for (const key in obj) {
        if (String(key).toLowerCase().includes(searchKeyLower)) {
            return obj[key];
        }
    }
    return '';
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}
