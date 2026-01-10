# Panduan Deploy Website ke Hosting Gratis

## 🚀 Metode 1: Netlify (PALING MUDAH - Direkomendasikan)

### Langkah-langkah:

1. **Siapkan File Project**
   - Pastikan semua file sudah ada: `index.html`, `styles.css`, `app.js`, `config.js`
   - Pastikan `config.js` sudah dikonfigurasi dengan benar

2. **Deploy ke Netlify:**
   - Buka website: https://www.netlify.com
   - Klik "Sign up" (gratis) - bisa login dengan GitHub/Google/Email
   - Setelah login, drag & drop folder project ke area "Deploy manually"
   - Tunggu beberapa detik, website akan langsung online!
   - Netlify akan memberikan URL seperti: `https://random-name-123.netlify.app`

3. **Optional - Custom Domain:**
   - Klik "Domain settings" di dashboard
   - Klik "Add custom domain"
   - Masukkan domain Anda (jika punya)

**Keuntungan Netlify:**
- ✅ Gratis selamanya
- ✅ HTTPS otomatis
- ✅ CDN global (cepat di seluruh dunia)
- ✅ Mudah digunakan (drag & drop)
- ✅ Auto deploy dari Git (opsional)

---

## 🌐 Metode 2: Vercel

### Langkah-langkah:

1. **Siapkan File Project**
   - Pastikan semua file sudah ada

2. **Deploy ke Vercel:**
   - Buka website: https://vercel.com
   - Klik "Sign Up" (gratis) - bisa login dengan GitHub/Google/GitLab
   - Setelah login, klik "Add New..." → "Project"
   - Drag & drop folder project atau import dari Git
   - Klik "Deploy"
   - Website akan langsung online!

**Keuntungan Vercel:**
- ✅ Gratis selamanya
- ✅ HTTPS otomatis
- ✅ Sangat cepat (Edge Network)
- ✅ Auto deploy dari Git

---

## 📦 Metode 3: GitHub Pages

### Langkah-langkah:

1. **Buat Repository GitHub:**
   - Buka https://github.com
   - Buat akun baru (jika belum punya) - GRATIS
   - Klik "New repository"
   - Beri nama repository (misalnya: `pendataan-ibu-anak`)
   - Pilih "Public"
   - Klik "Create repository"

2. **Upload File ke GitHub:**
   - Install GitHub Desktop: https://desktop.github.com
   - Atau gunakan Git command line:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/USERNAME/REPO-NAME.git
     git push -u origin main
     ```
   - Upload semua file project ke repository

3. **Aktifkan GitHub Pages:**
   - Di repository GitHub, klik tab "Settings"
   - Scroll ke bagian "Pages" (di sidebar kiri)
   - Di "Source", pilih "Deploy from a branch"
   - Pilih branch: "main"
   - Pilih folder: "/ (root)"
   - Klik "Save"
   - Website akan online di: `https://USERNAME.github.io/REPO-NAME`

**Keuntungan GitHub Pages:**
- ✅ Gratis selamanya
- ✅ HTTPS otomatis
- ✅ Terintegrasi dengan Git
- ✅ Unlimited bandwidth

---

## 🔥 Metode 4: Firebase Hosting

### Langkah-langkah:

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login Firebase:**
   ```bash
   firebase login
   ```

3. **Init Firebase:**
   ```bash
   firebase init hosting
   ```
   - Pilih "Use an existing project" atau buat project baru
   - Public directory: `.` (root)
   - Single-page app: No
   - GitHub auto-deploy: No

4. **Deploy:**
   ```bash
   firebase deploy
   ```

**Keuntungan Firebase:**
- ✅ Gratis (dengan quota)
- ✅ HTTPS otomatis
- ✅ CDN global
- ✅ Custom domain mudah

---

## 📋 Checklist Sebelum Deploy

Sebelum deploy, pastikan:

- [ ] File `config.js` sudah dikonfigurasi dengan benar
- [ ] URL Google Spreadsheet/Apps Script sudah benar
- [ ] Semua file penting sudah ada:
  - [ ] `index.html`
  - [ ] `styles.css`
  - [ ] `app.js`
  - [ ] `config.js`
- [ ] Spreadsheet sudah di-publish atau Apps Script sudah di-deploy
- [ ] Test website di localhost dulu (buka `index.html` di browser)

---

## 🎯 Rekomendasi

**Untuk Pemula:**
👉 Gunakan **Netlify** - paling mudah, drag & drop saja!

**Untuk yang Sudah Kenal Git:**
👉 Gunakan **GitHub Pages** - gratis, terintegrasi dengan Git

**Untuk Performa Terbaik:**
👉 Gunakan **Vercel** - sangat cepat dan modern

---

## ⚠️ Catatan Penting

1. **CORS Issues:**
   - Jika menggunakan CSV URL langsung, mungkin ada masalah CORS
   - Solusi: Gunakan Google Apps Script (sudah ada contohnya di `google-apps-script-example.js`)

2. **HTTPS:**
   - Semua platform di atas sudah menyediakan HTTPS gratis
   - Pastikan Google Spreadsheet/Apps Script juga menggunakan HTTPS

3. **Custom Domain:**
   - Semua platform di atas mendukung custom domain gratis
   - Hanya perlu menambahkan DNS records

---

## 🆘 Troubleshooting

**Website tidak bisa akses Google Spreadsheet:**
- Pastikan spreadsheet sudah di-publish secara public
- Atau gunakan Google Apps Script untuk menghindari CORS
- Cek console browser (F12) untuk melihat error

**Data tidak muncul:**
- Cek `config.js` - pastikan URL sudah benar
- Pastikan spreadsheet/Apps Script sudah accessible
- Test URL langsung di browser

---

## 📞 Butuh Bantuan?

Jika ada masalah saat deploy, coba:
1. Buka console browser (F12) - lihat error apa
2. Test website di localhost dulu
3. Pastikan semua file sudah di-upload
4. Cek dokumentasi platform yang digunakan

