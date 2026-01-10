// Aplikasi untuk mengambil dan menampilkan data dari Google Spreadsheet

let currentData = [];
let filteredData = [];

// Initialize aplikasi
document.addEventListener('DOMContentLoaded', function() {
    const refreshBtn = document.getElementById('refreshBtn');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const categorySelect = document.getElementById('categorySelect');
    
    refreshBtn.addEventListener('click', loadData);
    
    // Setup search functionality
    searchInput.addEventListener('input', handleSearch);
    clearSearchBtn.addEventListener('click', clearSearch);
    
    // Setup category filter
    categorySelect.addEventListener('change', handleCategoryChange);
    
    // Allow Enter key to trigger search
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            clearSearch();
            searchInput.blur();
        }
    });
    
    // Load data saat pertama kali dibuka
    loadData();
});

// Fungsi untuk mengambil data dari Google Spreadsheet
async function loadData() {
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    const tableBody = document.getElementById('tableBody');
    const tableHeader = document.getElementById('tableHeader');
    const emptyState = document.getElementById('emptyState');
    const refreshBtn = document.getElementById('refreshBtn');
    
    // Show loading
    loading.style.display = 'flex';
    errorMessage.style.display = 'none';
    refreshBtn.disabled = true;
    tableBody.innerHTML = '';
    
    try {
        let data;
        
        // Cek konfigurasi yang digunakan
        if (CONFIG.APPS_SCRIPT_URL) {
            // Menggunakan Google Apps Script
            data = await loadFromAppsScript();
        } else if (CONFIG.CSV_URL) {
            // Menggunakan CSV export
            data = await loadFromCSV();
        } else if (CONFIG.SPREADSHEET_ID && CONFIG.API_KEY) {
            // Menggunakan Google Sheets API
            data = await loadFromAPI();
        } else {
            throw new Error('Silakan konfigurasi CONFIG di file config.js');
        }
        
        if (!data || data.length === 0) {
            showEmptyState();
            return;
        }
        
        currentData = data;
        filteredData = data;
        
        // Debug: log hasil parsing
        console.log('Data loaded successfully:', data);
        if (data.length > 0) {
            console.log('First row:', data[0]);
            console.log('Headers:', Object.keys(data[0]));
        }
        
        // Apply current filters
        applyFilters();
        
    } catch (error) {
        console.error('Error loading data:', error);
        console.error('Error details:', error);
        showError(error.message || 'Terjadi kesalahan saat memuat data. Pastikan spreadsheet sudah di-publish atau cek konfigurasi. Buka console (F12) untuk detail error.');
        showEmptyState();
    } finally {
        loading.style.display = 'none';
        refreshBtn.disabled = false;
    }
}

// Mengambil data dari CSV (cara termudah)
async function loadFromCSV() {
    const response = await fetch(CONFIG.CSV_URL);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle encoding dengan benar
    const csvText = await response.text();
    
    // Debug: log data yang diterima (optional, bisa dihapus)
    console.log('CSV loaded, length:', csvText.length);
    
    const data = parseCSV(csvText);
    console.log('Parsed data:', data.length, 'rows');
    
    return data;
}

// Mengambil data dari Google Apps Script
async function loadFromAppsScript() {
    const response = await fetch(CONFIG.APPS_SCRIPT_URL);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const json = await response.json();
    return json.data || json;
}

// Mengambil data dari Google Sheets API
async function loadFromAPI() {
    const sheetName = CONFIG.SHEET_NAME || 'Sheet1';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${sheetName}?key=${CONFIG.API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const json = await response.json();
    return convertAPIResponseToArray(json.values);
}

// Parse CSV text menjadi array of objects
function parseCSV(csvText) {
    // Handle BOM (Byte Order Mark) yang kadang muncul di CSV
    if (csvText.charCodeAt(0) === 0xFEFF) {
        csvText = csvText.slice(1);
    }
    
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length === 0) return [];
    
    // Parse header
    const headers = parseCSVLine(lines[0]).map(h => h.trim());
    
    // Parse data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length === 0) continue;
        
        const values = parseCSVLine(line);
        
        // Skip baris kosong
        if (values.every(v => v.trim() === '')) continue;
        
        const row = {};
        headers.forEach((header, index) => {
            // Handle header yang kosong
            const headerName = header || `Kolom ${index + 1}`;
            row[headerName] = (values[index] || '').trim();
        });
        data.push(row);
    }
    
    return data;
}

// Parse satu baris CSV (handle quotes dan commas)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote inside quoted field
                current += '"';
                i++; // Skip next quote
            } else if (inQuotes && nextChar === ',') {
                // End of quoted field
                inQuotes = false;
            } else {
                // Start or end of quoted field
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // Field separator
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    // Push last field
    result.push(current);
    
    return result;
}

// Convert Google Sheets API response menjadi array of objects
function convertAPIResponseToArray(values) {
    if (!values || values.length === 0) return [];
    
    const headers = values[0];
    const data = [];
    
    for (let i = 1; i < values.length; i++) {
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[i][index] || '';
        });
        data.push(row);
    }
    
    return data;
}

// Fungsi untuk mendapatkan kolom yang harus ditampilkan berdasarkan kategori
function getColumnsByCategory(kategori, allHeaders) {
    const kategoriStr = String(kategori || '').trim();
    const kategoriLower = kategoriStr.toLowerCase();
    
    // Kolom yang selalu ditampilkan
    const fixedColumns = ['Timestamp', 'PILIH PERTANYAAN'];
    
    // Tentukan range kolom berdasarkan kategori
    let categoryColumns = [];
    
    if (kategoriLower.includes('baduta') || kategoriLower.includes('balita')) {
        // Baduta dan balita: ambil kolom C-R (indeks 2-17 dari headers array)
        // Asumsikan struktur: A=Timestamp(0), B=PILIH PERTANYAAN(1), C-R=Baduta(2-17), S-AG=Ibu Hamil(18+)
        const startIndex = 2; // Kolom C (index 2, karena A=0, B=1)
        const endIndex = 18;  // Sampai kolom R (index 17, jadi endIndex = 18 untuk slice)
        categoryColumns = allHeaders.slice(startIndex, endIndex);
    } else if (kategoriLower.includes('ibu hamil') || kategoriLower.includes('hamil')) {
        // Ibu Hamil: ambil kolom S-AG (indeks 18-32 dari headers array)
        const startIndex = 18; // Kolom S (index 18)
        const endIndex = 33;   // Sampai kolom AG (index 32, jadi endIndex = 33 untuk slice)
        categoryColumns = allHeaders.slice(startIndex, endIndex);
    } else {
        // Jika kategori tidak diketahui, tampilkan semua kolom selain fixed (fallback)
        categoryColumns = allHeaders.filter(h => !fixedColumns.includes(h));
    }
    
    // Gabungkan kolom tetap dengan kolom kategori
    return [...fixedColumns, ...categoryColumns];
}

// Fungsi untuk mendapatkan kolom berdasarkan pilihan dropdown
function getDisplayColumnsBySelection(selectedCategory, allHeaders) {
    const fixedColumns = ['Timestamp', 'PILIH PERTANYAAN'];
    let categoryColumns = [];
    
    if (selectedCategory === 'baduta') {
        // Baduta dan balita: ambil kolom C-R (indeks 2-17)
        categoryColumns = allHeaders.slice(2, 18);
    } else if (selectedCategory === 'ibu-hamil') {
        // Ibu Hamil: ambil kolom S-AG (indeks 18-32)
        categoryColumns = allHeaders.slice(18, Math.min(33, allHeaders.length));
    } else {
        // Default: Baduta dan balita jika kategori tidak dikenali
        categoryColumns = allHeaders.slice(2, 18);
    }
    
    return [...fixedColumns, ...categoryColumns];
}

// Menampilkan data ke tabel
function displayData(data) {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    
    if (data.length === 0) {
        // Don't show empty state here, let the caller handle it
        tableBody.innerHTML = '';
        return;
    }
    
    // Get semua headers dari data pertama untuk referensi
    const allHeaders = Object.keys(data[0]);
    
    // Ambil pilihan kategori dari dropdown
    const categorySelect = document.getElementById('categorySelect');
    const selectedCategory = categorySelect ? categorySelect.value : 'baduta';
    
    // Tentukan kolom yang akan ditampilkan berdasarkan pilihan dropdown
    const displayColumns = getDisplayColumnsBySelection(selectedCategory, allHeaders);
    
    // Mapping nama kolom untuk tampilan yang lebih baik
    const headerLabels = {
        'Timestamp': 'Waktu',
        'PILIH PERTANYAAN': 'Kategori',
        'NAMA IBU': 'Nama Ibu',
        'NIK IBU': 'NIK Ibu',
        'JENIS KB': 'Jenis KB',
        'Tanggal Lahir': 'Tanggal Lahir',
        'Umur Kandungan': 'Umur Kandungan',
        'Jenis Kelamin': 'Jenis Kelamin',
        'Anak keberapa': 'Anak Ke-',
        'Berat Bad': 'Berat Badan'
    };
    
    // Create header row
    tableHeader.innerHTML = '';
    displayColumns.forEach(header => {
        const th = document.createElement('th');
        th.textContent = headerLabels[header] || header;
        tableHeader.appendChild(th);
    });
    
    // Create data rows
    tableBody.innerHTML = '';
    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        const kategori = String(row['PILIH PERTANYAAN'] || '').trim();
        const kategoriLower = kategori.toLowerCase();
        
        // Tentukan kolom yang relevan untuk row ini
        let rowColumns = [];
        if (selectedCategory === 'baduta' && (kategoriLower.includes('baduta') || kategoriLower.includes('balita'))) {
            rowColumns = getColumnsByCategory(kategori, allHeaders);
        } else if (selectedCategory === 'ibu-hamil' && (kategoriLower.includes('ibu hamil') || kategoriLower.includes('hamil'))) {
            rowColumns = getColumnsByCategory(kategori, allHeaders);
        } else {
            // Kategori tidak cocok dengan filter, skip row ini (seharusnya sudah di-filter sebelumnya)
            return;
        }
        
        // Tampilkan nilai untuk setiap kolom di displayColumns
        displayColumns.forEach(header => {
            const td = document.createElement('td');
            let cellValue = '';
            
            // Tampilkan nilai jika kolom ini ada di rowColumns
            if (rowColumns.includes(header)) {
                cellValue = row[header] || '';
            }
            
            // Format khusus untuk beberapa kolom
            if (header === 'Timestamp' && cellValue) {
                // Format tanggal jika perlu
                try {
                    const date = new Date(cellValue);
                    if (!isNaN(date.getTime())) {
                        cellValue = date.toLocaleString('id-ID');
                    }
                } catch (e) {
                    // Keep original value
                }
            }
            
            td.textContent = cellValue;
            td.setAttribute('data-label', headerLabels[header] || header); // Untuk mobile view
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
    
    // Update result count
    updateResultCount(data.length, currentData.length);
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Show empty state
function showEmptyState() {
    const emptyState = document.getElementById('emptyState');
    const tableWrapper = document.querySelector('.table-wrapper');
    emptyState.style.display = 'block';
    if (tableWrapper) {
        tableWrapper.style.display = 'none';
    }
}

// Hide empty state
function hideEmptyState() {
    const emptyState = document.getElementById('emptyState');
    const tableWrapper = document.querySelector('.table-wrapper');
    emptyState.style.display = 'none';
    if (tableWrapper) {
        tableWrapper.style.display = 'block';
    }
}

// Handle category change
function handleCategoryChange() {
    applyFilters();
}

// Apply all filters (category + search)
function applyFilters() {
    const categorySelect = document.getElementById('categorySelect');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    const selectedCategory = categorySelect ? categorySelect.value : 'all';
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    // Show/hide clear button
    if (clearSearchBtn) {
        if (searchTerm.length > 0) {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
        }
    }
    
    // Filter berdasarkan kategori
    let categoryFiltered = currentData.filter(row => {
        const kategori = String(row['PILIH PERTANYAAN'] || '').trim().toLowerCase();
        if (selectedCategory === 'baduta') {
            return kategori.includes('baduta') || kategori.includes('balita');
        } else if (selectedCategory === 'ibu-hamil') {
            return kategori.includes('ibu hamil') || kategori.includes('hamil');
        }
        return false;
    });
    
    // Filter berdasarkan search term
    if (searchTerm.length === 0) {
        filteredData = categoryFiltered;
    } else {
        filteredData = categoryFiltered.filter(row => {
            // Search in all column values
            return Object.values(row).some(value => {
                const stringValue = String(value || '').toLowerCase();
                return stringValue.includes(searchTerm);
            });
        });
    }
    
    // Display filtered data
    if (filteredData.length === 0) {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';
        updateResultCount(0, currentData.length);
        
        if (searchTerm.length > 0) {
            const emptyState = document.getElementById('emptyState');
            emptyState.innerHTML = '<p>🔍 Tidak ada data yang cocok dengan pencarian "<strong>' + escapeHtml(searchTerm) + '</strong>"</p>';
            emptyState.style.display = 'block';
            const tableWrapper = document.querySelector('.table-wrapper');
            if (tableWrapper) {
                tableWrapper.style.display = 'none';
            }
        } else {
            showEmptyState();
        }
    } else {
        displayData(filteredData);
        hideEmptyState();
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
    
    // Apply filters (termasuk category filter)
    applyFilters();
}

// Update result count
function updateResultCount(filtered, total) {
    const resultCount = document.getElementById('resultCount');
    if (filtered === total) {
        resultCount.textContent = `Menampilkan ${total} data`;
    } else {
        resultCount.textContent = `Menampilkan ${filtered} dari ${total} data`;
    }
}

// Escape HTML untuk keamanan
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

