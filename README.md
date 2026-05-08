# KPI Online Form

Web form KPI karyawan berbasis GitHub Pages yang meniru format lembar penilaian pada gambar referensi. Data diisi oleh kepala toko, lalu dikirim ke Google Sheets melalui Google Apps Script.

## Fitur

- Form KPI 9 indikator sesuai referensi
- Bobot penilaian otomatis dihitung menjadi total 100%
- Catatan tambahan per indikator
- Data identitas karyawan, penilai, jabatan, cabang, dan tanda tangan persetujuan
- Integrasi ke Google Sheets dengan 2 sheet: `Summary` dan `Detail`
- Bisa di-host langsung dari repository GitHub

## Struktur File

- `index.html`: tampilan form
- `styles.css`: desain halaman
- `script.js`: logika form, kalkulasi skor, dan submit ke webhook
- `google-apps-script.js`: script backend untuk Google Sheets

## Cara Pakai

### 1. Upload file ke repository GitHub

Masukkan semua file ini ke repo `utama1955/KPI`.

### 2. Buat Google Spreadsheet

1. Buat spreadsheet baru di Google Sheets.
2. Simpan `Spreadsheet ID` dari URL spreadsheet.

Contoh URL:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

### 3. Pasang Google Apps Script

1. Buka [Google Apps Script](https://script.google.com/).
2. Buat project baru.
3. Salin isi file `google-apps-script.js`.
4. Ganti:

```javascript
SpreadsheetApp.openById("PASTE_YOUR_SPREADSHEET_ID_HERE")
```

dengan `Spreadsheet ID` milik Anda.

### 4. Deploy Apps Script jadi Web App

1. Klik `Deploy` > `New deployment`.
2. Pilih type `Web app`.
3. Set `Who has access` ke `Anyone`.
4. Klik `Deploy`.
5. Salin URL Web App hasil deploy.

### 5. Hubungkan web ke Apps Script

Buka `script.js`, lalu ganti:

```javascript
const SHEETS_WEB_APP_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

dengan URL Web App dari Apps Script.

### 6. Aktifkan GitHub Pages

1. Push project ke GitHub.
2. Buka `Settings` repo.
3. Masuk ke menu `Pages`.
4. Pada `Build and deployment`, pilih `Deploy from a branch`.
5. Pilih branch utama dan folder `/root`.

Setelah itu form akan punya URL online sendiri.

## Format Data yang Tersimpan

### Sheet `Summary`

Satu baris per penilaian:

- waktu submit
- tanggal penilaian
- nama
- jabatan
- cabang
- penilai
- tanda tangan
- total skor
- predikat
- catatan umum

### Sheet `Detail`

Banyak baris per penilaian, masing-masing indikator disimpan terpisah:

- waktu submit
- nama
- id indikator
- judul indikator
- bobot
- kode nilai
- nilai angka
- nilai tertimbang
- catatan indikator

## Catatan

- Karena frontend berjalan di GitHub Pages, backend terbaik memang memakai Google Apps Script atau API server Anda sendiri.
- Jika Anda mau, tahap berikutnya saya bisa bantu lanjutkan dengan:
  - membuat logo/header lebih mirip form asli,
  - menambahkan proteksi login sederhana,
  - menyiapkan file git lalu push ke repo GitHub,
  - atau langsung membuat versi dengan halaman admin ringkasan hasil.
