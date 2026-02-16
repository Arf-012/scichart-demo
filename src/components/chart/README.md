# Direktori Chart Components

Direktori ini berisi semua logika yang berkaitan dengan implementasi SciChart.

## File Inti

Berikut adalah penjelasan fungsi-fungsi yang mungkin membingungkan:

### `createCandlestickChart.ts`

Ini adalah **"Otak"** dari grafik. File ini berfungsi sebagai:

1.  Inisialisasi `SciChartSurface` (kanvas grafik).
2.  Memanggil konfigurasi sumbu (`configureAxes`), modifier (`configureModifiers`), dan series (`configureSeries`).
3.  Menggabungkan logika data dan kontrol (`ChartData`, `ChartControls`) menjadi satu objek return value.
    **Tips:** Jika Anda ingin mengubah urutan inisialisasi atau menambah komponen global baru, mulai dari sini.

### `ChartInitialization.ts`

File ini adalah **"Jembatan"** antara React UI (`App.tsx`) dan logika SciChart.
Ia menerima `providerId` (misal "binance"), lalu:

1.  Memanggil `createCandlestickChart`.
2.  Mengambil data historis dari provider terpilih.
3.  Mengisi data ke grafik.
4.  Melakukan subscribe ke WebSocket provider untuk update realtime.

### `configureModifiers.ts`

Mengatur interaksi pengguna, seperti:

- **ZoomPanModifier**: Untuk geser-geser grafik.
- **PinchZoomModifier**: Untuk zoom cubit di layar sentuh.
- **MouseWheelZoomModifier**: Zoom pakai scroll mouse.
- **SelectionModifier**: Custom modifier untuk memilih annotation (klik box/garis).

## Sub-direktori

- **`tools/`**: Berisi logika alat gambar (Garis, Kotak).
- **`utils/`**: Fungsi pembantu (helper) agar kode utama tidak berantakan.
- **`templates/`**: Template HTML/SVG untuk tooltip custom.

## Cara Maintenance

- **Ubah Tampilan Grafik (Warna Candle, dll)**: Edit `configureSeries.ts`.
- **Ubah Format Angka/Tanggal Sumbu**: Edit `configureAxes.ts`.
- **Ubah Perilaku Zoom/Geser**: Edit `configureModifiers.ts`.
