// Aplikasi untuk mengambil dan menampilkan data SUB dari Google Spreadsheet

let currentData = [];
let filteredData = [];

// Initialize aplikasi
document.addEventListener('DOMContentLoaded', function() {
    const refreshBtn = document.getElementById('refreshBtn');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    refreshBtn.addEventListener('click', loadData);
    
    // Setup search functionality
    searchInput.addEventListener('input', handleSearch);
    clearSearchBtn.addEventListener('click', clearSearch);
    
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
        
        // Cek konfigurasi Apps Script
        if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL.includes('YOUR_')) {
            throw new Error('Silakan konfigurasi APPS_SCRIPT_URL di file sub-config.js. Lihat panduan di docs/APPS_SCRIPT_GUIDE.md');
        }
        
        // Menggunakan Google Apps Script
        data = await loadFromAppsScript();
        
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
        showError(error.message || 'Terjadi kesalahan saat memuat data. Pastikan Apps Script sudah di-deploy dengan benar. Buka console (F12) untuk detail error.');
        showEmptyState();
    } finally {
        loading.style.display = 'none';
        refreshBtn.disabled = false;
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

// Menampilkan data ke tabel
function displayData(data) {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    
    if (data.length === 0) {
        tableBody.innerHTML = '';
        return;
    }
    
    // Get semua headers dari data pertama
    const allHeaders = Object.keys(data[0]);
    
    // Mapping nama kolom untuk tampilan yang lebih baik
    const headerLabels = {
        'Timestamp': 'Waktu',
        'Nama Kader': 'Nama Kader',
        'Nama Akseptor': 'Nama Akseptor',
        'NIK': 'NIK',
        'No. HP': 'No. HP',
        'Usia': 'Usia',
        'Jumlah Anak': 'Jumlah Anak',
        'Nama Suami': 'Nama Suami'
    };
    
    // Create header row - tampilkan semua kolom
    tableHeader.innerHTML = '';
    allHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = headerLabels[header] || header;
        tableHeader.appendChild(th);
    });
    
    // Create data rows
    tableBody.innerHTML = '';
    data.forEach((row) => {
        const tr = document.createElement('tr');
        
        // Tampilkan semua kolom
        allHeaders.forEach(header => {
            const td = document.createElement('td');
            let cellValue = row[header] || '';
            
            // Format khusus untuk beberapa kolom
            if (header === 'Timestamp' && cellValue) {
                try {
                    const date = new Date(cellValue);
                    if (!isNaN(date.getTime())) {
                        cellValue = date.toLocaleString('id-ID');
                    }
                } catch (e) {
                    // Keep original value
                }
            }
            
            // Buat span untuk value agar lebih mudah di-style
            const valueSpan = document.createElement('span');
            valueSpan.className = 'cell-value';
            valueSpan.textContent = cellValue;
            td.appendChild(valueSpan);
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

// Apply filters (hanya search, tanpa kategori)
function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    // Show/hide clear button
    if (clearSearchBtn) {
        if (searchTerm.length > 0) {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
        }
    }
    
    // Filter berdasarkan search term
    if (searchTerm.length === 0) {
        filteredData = currentData;
    } else {
        filteredData = currentData.filter(row => {
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
    
    // Apply filters
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
