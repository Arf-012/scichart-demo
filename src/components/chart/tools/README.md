# Direktori Chart Tools

Direktori ini berisi logika untuk alat-alat anotasi interaktif yang ada di toolbar (Garis, Kotak, Hapus).

## Penjelasan File

- **`LineAnnotaion.ts`**: Logika untuk membuat Garis Trend.
- **`BoxAnnotation.ts`**: Logika untuk membuat Kotak Area. Menggunakan helper `TooltipBehavior` untuk menampilkan statistik di dalamnya.
- **`DeleteAnnotatation.ts`**: Logika untuk menghapus anotasi yang sedang terpilih (selected).
- **`SelectionModifier.ts`**: Modifier khusus yang mendeteksi klik pada anotasi agar bisa dipilih (muncul handler resize).

## Panduan: Cara Menambah Annotation Tool Baru

Misalnya, kita ingin membuat alat untuk menambahkan **Teks (TextAnnotation)**.

### Langkah 1: Buat File Baru

Buat file `TextAnnotation.ts` di folder ini.

```typescript
import { SciChartSurface, TextAnnotation, ECoordinateMode } from "scichart";
import { calculateCenter } from "../../../utils/calculateCenter";

export const addTextAnnotation = (
  sciChartSurface: SciChartSurface,
  xAxisId: string,
  yAxisId: string,
) => {
  // 1. Hitung posisi tengah layar agar teks muncul di tengah
  const { centerX, centerY } = calculateCenter(
    sciChartSurface,
    xAxisId,
    yAxisId,
  );

  // 2. Buat objek TextAnnotation
  const textAnnotation = new TextAnnotation({
    x1: centerX,
    y1: centerY,
    text: "Teks Baru",
    fontSize: 20,
    textColor: "White",
    xAxisId,
    yAxisId,
    isEditable: true, // Agar bisa diedit/digeser user
  });

  // 3. Tambahkan ke grafik
  sciChartSurface.annotations.add(textAnnotation);
};
```

### Langkah 2: Expose Fungsi di Controls

Buka `src/components/chart/utils/ChartControls.ts`. Tambahkan fungsi baru di interface dan implementasinya.

```typescript
// Di dalam ChartControls
const addText = () => {
  addTextAnnotation(sciChartSurface, xAxis.id, yAxis.id);
};

return {
  // ... controls lain ...
  addTextAnnotation: addText, // Expose keluar
};
```

### Langkah 3: Perbarui Interface React Ref

Buka `src/App.tsx` dan tambahkan `addTextAnnotation` ke definisi tipe ref `chartControlsRef`.

```typescript
const chartControlsRef = React.useRef<{
  // ... yang lama ...
  addTextAnnotation: () => void; // Tambah ini
}>(undefined);
```

### Langkah 4: Tambah Tombol di Toolbar

Buka `src/components/ui/ChartToolbar.tsx`.
Tambahkan tombol baru yang memanggil `onAddText`.

```tsx
// Di App.tsx:
<ChartToolbar
  onAddText={() => chartControlsRef.current?.addTextAnnotation()}
  // ... props lain ...
/>
```

Selesai! Sekarang user bisa klik tombol tersebut dan teks akan muncul di tengah grafik.
