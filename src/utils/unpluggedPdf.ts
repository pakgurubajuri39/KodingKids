import { jsPDF } from 'jspdf';

export interface UnpluggedItem {
  id: string;
  docCode: string;
  title: string;
  category: string;
  ageGroup: string;
  estimatedTime: string;
  learningGoals: string[];
  description: string;
  instructions: string[];
  materials: string[];
  rules: string[];
  printableType: 'maze' | 'cards' | 'binary' | 'pattern';
}

export const UNPLUGGED_ACTIVITIES: UnpluggedItem[] = [
  {
    id: 'unplugged-1',
    docCode: 'LKPD-CSU-01',
    title: 'Labirin Kertas Algoritma (Paper Maze Runner)',
    category: 'Sequencing, Navigasi & Logika Algoritma',
    ageGroup: '6 - 11 Tahun',
    estimatedTime: '25 - 35 Menit',
    learningGoals: [
      'Memahami konsep algoritma sekuensial (urutan instruksi langkah demi langkah)',
      'Melatih dekomposisi masalah dan navigasi koordinat spasial 2D',
      'Mengembangkan kemampuan berpikir analitis tanpa ketergantungan layar gadget'
    ],
    description: 'Bantu si Robot Cilik menavigasi grid koordinat menuju stasiun pengisian daya dengan menghindari rintangan batu dan mengumpulkan koin bintang. Siswa merumuskan deretan perintah langkah menggunakan simbol panah terstruktur.',
    instructions: [
      'Tuliskan identitas diri lengkap pada kolom identitas siswa di atas lembar kerja.',
      'Analisis peta grid koordinat (Baris A-F, Kolom 1-6). Tentukan posisi START Robot di [A1] dan FINISH di [F6].',
      'Gunakan pensil warna untuk menggambar rute teraman. Hati-hati jangan menabrak rintangan batu [B3], kolam air [D2], dan lubang hitam [E5]!',
      'Ambil koin bintang bonus yang terletak di koordinat [C4] dan [E3] untuk skor maksimal.',
      'Tuliskan urutan kode algoritma pada Tabel Perintah di bawah grid (Gunakan simbol panah ↑, ↓, ←, → dan nama aksi).',
      'Mintalah guru atau orang tua untuk memeriksa ketepatan rute dan membubuhkan tanda tangan.'
    ],
    materials: ['Pensil / Bolpoin', 'Pensil Warna / Crayon (Merah, Hijau, Biru)', 'Penggaris', 'Lembar Kerja A4 ini'],
    rules: [
      'Robot hanya bisa bergerak 1 petak dalam satu langkah.',
      'Robot tidak boleh melompati rintangan batu atau lubang hitam.',
      'Setiap langkah maju harus dicatat koordinat baris dan kolom barunya.'
    ],
    printableType: 'maze'
  },
  {
    id: 'unplugged-2',
    docCode: 'LKPD-CSU-02',
    title: 'Kartu Perintah Robot Cilik (Cut & Paste Code Cards)',
    category: 'Perintah Eksekusi, Looping & Pemrograman Fisik',
    ageGroup: '6 - 12 Tahun',
    estimatedTime: '30 - 45 Menit',
    learningGoals: [
      'Memahami konsep eksekusi perintah kode terstruktur melalui manipulasi fisik',
      'Mengenal instruksi pengulangan (Looping / Repeat Block)',
      'Mengembangkan komunikasi kolaboratif antara Programmer dan Robot melalui permainan peran (Roleplay)'
    ],
    description: 'Aktivitas fisik kinetik menyenangkan: siswa menggunting 12 kartu perintah koding, memilih peran (Programmer atau Robot), dan menyusun alur program pada papan instruksi untuk mengarahkan teman/keluarga bergerak di ruangan.',
    instructions: [
      'Gunting secara hati-hati 12 kartu perintah pada area guntingan sesuai garis putus-putus.',
      'Tentukan peran: Siswa bertindak sebagai "Programmer" dan teman/orang tua bertindak sebagai "Robot".',
      'Programmer memilih 4 sampai 8 kartu aksi dan menempelkannya secara berurutan pada Kolom Papan Alur Program.',
      'Tekan tombol maya "START" pada robot dengan menepuk pundaknya dengan lembut.',
      'Robot harus bergerak maju, belok, melompat, atau mengulangi gerakan persis sesuai susunan kartu!',
      'Jika robot menabrak kursi atau dinding, teriakkan "BUG!" dan lakukan proses perbaikan program (Debugging).'
    ],
    materials: ['Gunting Kertas Ujung Tumpul (didampingi orang tua)', 'Lem Kertas (Stick Glue)', 'Ruang Lantai Kamar / Kelas'],
    rules: [
      'Robot dilarang bergerak sendiri tanpa instruksi kartu tertulis.',
      'Kartu ULANGI 2x harus diletakkan setelah kartu aksi yang ingin diulang.',
      'Kartu STOP harus menjadi penutup seluruh rangkaian program.'
    ],
    printableType: 'cards'
  },
  {
    id: 'unplugged-3',
    docCode: 'LKPD-CSU-03',
    title: 'Gelang Manik Kode Biner (Binary Bracelet DIY)',
    category: 'Representasi Data Digital (Bit & Byte)',
    ageGroup: '7 - 14 Tahun',
    estimatedTime: '30 - 40 Menit',
    learningGoals: [
      'Memahami bagaimana komputer merepresentasikan karakter teks menjadi angka 0 dan 1 (Sistem Biner)',
      'Mengenal standar pengkodean ASCII 8-bit komputer',
      'Mengonversi nama panggilan menjadi pola manik-manik aksesoris nyata bernilai edukatif'
    ],
    description: 'Komputer dan smartphone tidak membaca huruf abjad seperti manusia, melainkan denyut listrik ON (1) dan OFF (0). Siswa belajar kode biner 8-bit untuk setiap huruf, mengonversi nama mereka, dan merancang gelang manik rahasia.',
    instructions: [
      'Pelajari tabel konversi kode biner 8-bit huruf A sampai Z yang tercantum di lembar kerja ini.',
      'Tuliskan nama panggilanmu (3 hingga 6 huruf) pada tabel dekomposisi nama.',
      'Tuliskan 8 digit biner untuk masing-masing huruf namamu (contoh huruf A = 01000001).',
      'Tentukan kode warna: Angka 0 = Manik Warna Biru / Gelap, dan Angka 1 = Manik Warna Kuning / Terang.',
      'Warnai lingkaran simulasi pada kertas terlebih dahulu untuk memastikan tidak ada kekeliruan.',
      'Rangkai manik-manik pada tali elastis sesuai pola biner yang telah kamu buat. Ikat simpul kuat.',
      'Pecahkan teka-teki kata rahasia yang tertera di bagian bawah lembar kerja!'
    ],
    materials: ['Tali Benang Elastis / Senar / Wol (± 25 cm)', 'Manik-manik 2 warna berbeda (atau sedotan dipotong kecil)', 'Pensil Warna'],
    rules: [
      'Setiap huruf wajib memiliki tepat 8 digit angka biner (1 Byte).',
      'Urutan angka biner harus dibaca dari kiri ke kanan (Most Significant Bit to Least Significant Bit).'
    ],
    printableType: 'binary'
  },
  {
    id: 'unplugged-4',
    docCode: 'LKPD-CSU-04',
    title: 'Detektif Pola & Logika (Pattern & Condition Detective)',
    category: 'Computational Thinking: Pattern Recognition & IF-ELSE',
    ageGroup: '6 - 12 Tahun',
    estimatedTime: '25 - 35 Menit',
    learningGoals: [
      'Mengasah kemampuan Pattern Recognition (Pengenalan Pola) pada deret simbol dan bentuk',
      'Memahami konsep percabangan logika kondisi (IF - THEN - ELSE / JIKA - MAKA)',
      'Membangun fondasi logika berpikir kritis dalam memecahkan masalah matematis dan algoritma'
    ],
    description: 'Menjadi detektif koding cilik yang memecahkan 5 studi kasus teka-teki logika: pola berulang (looping), pola berurutan naik, sequencing aktivitas kehidupan sehari-hari, serta logika percabangan kondisi JIKA-MAKA.',
    instructions: [
      'Amati dengan teliti urutan bentuk, warna, dan angka pada setiap nomor soal.',
      'Identifikasi pola pengulangan atau aturan matematika yang mendasarinya.',
      'Gambar atau tuliskan jawaban yang tepat pada kotak tanda tanya [ ? ].',
      'Pada soal percabangan IF-ELSE, tentukan aksi robot yang paling tepat sesuai kondisi cuaca dan baterai.',
      'Pada soal terakhir, rancang pola rahasiamu sendiri dan mintalah orang tua untuk menebak jawabannya!'
    ],
    materials: ['Pensil Tulis', 'Penghapus', 'Pensil Warna / Spidol', 'Lembar Kerja A4 ini'],
    rules: [
      'Jawablah secara mandiri terlebih dahulu sebelum berdiskusi dengan pendamping.',
      'Tuliskan alasan logika di samping setiap jawaban yang kamu pilih.'
    ],
    printableType: 'pattern'
  }
];

/**
 * Helper to render official KodingKids Header on any page
 */
function drawPageHeader(doc: jsPDF, activity: UnpluggedItem, pageNum: number, totalPages: number) {
  const pageWidth = 210;
  const marginX = 14;

  // Top color accents
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, pageWidth, 5, 'F');
  doc.setFillColor(245, 158, 11); // Amber-500
  doc.rect(0, 5, pageWidth, 2.5, 'F');

  // Institution title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('KODINGKIDS ACADEMY INDONESIA', marginX, 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(217, 119, 6);
  doc.text('LEMBAR KERJA PESERTA DIDIK (LKPD) - COMPUTER SCIENCE UNPLUGGED', marginX, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Belajar Logika Pemrograman & Computational Thinking Bebas Gadget', marginX, 24);

  // Document Badge
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(pageWidth - marginX - 42, 10, 42, 15, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('KODE DOKUMEN:', pageWidth - marginX - 21, 15, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(activity.docCode, pageWidth - marginX - 21, 20.5, { align: 'center' });

  // Page Indicator
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Halaman ${pageNum} dari ${totalPages}`, pageWidth - marginX - 21, 23.5, { align: 'center' });

  // Horizontal divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.6);
  doc.line(marginX, 27, pageWidth - marginX, 27);
}

/**
 * Helper to render official footer
 */
function drawPageFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('@Copyright by. Pak GuruAI', pageWidth / 2, pageHeight - 6, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`KodingKids Academy • Hal ${pageNum}/${totalPages}`, pageWidth - marginX, pageHeight - 6, { align: 'right' });
}

/**
 * Professional Multi-Page Clean Vector PDF Worksheet Generator
 * Clean, perfectly spaced, zero-overlap 2-page curriculum format:
 * Page 1: Panduan Guru, Capaian Pembelajaran, Petunjuk Kerja & Rubrik Evaluasi
 * Page 2: Lembar Kerja Praktik Siswa (Aktivitas Mandiri / Gunting Tempel / Grid)
 */
export function generateUnpluggedPdf(activity: UnpluggedItem) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const marginX = 14;
  const contentWidth = pageWidth - (marginX * 2);

  // =========================================================================
  // PAGE 1: PANDUAN PEMBELAJARAN, IDENTITAS & PETUNJUK
  // =========================================================================
  drawPageHeader(doc, activity, 1, 2);

  // Student Profile Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginX, 30, contentWidth, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('IDENTITAS SISWA & PELAKSANAAN:', marginX + 4, 35.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('Nama Siswa   : _________________________________', marginX + 4, 42);
  doc.text('Kelas / Usia   : ________________ (___ Tahun)', marginX + 4, 47.5);

  doc.text('Hari / Tanggal  : ___________________________', marginX + 80, 42);
  doc.text('Waktu Mulai    : _________  Selesai: _________', marginX + 80, 47.5);

  // Score Box
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(pageWidth - marginX - 35, 32.5, 31, 15, 1.5, 1.5, 'D');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('NILAI / PARAF', pageWidth - marginX - 19.5, 37.5, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(217, 119, 6);
  doc.text('⭐⭐⭐⭐⭐', pageWidth - marginX - 19.5, 43.5, { align: 'center' });

  // Title Banner
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(marginX, 53, contentWidth, 16, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(activity.title.toUpperCase(), pageWidth / 2, 60, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(254, 240, 138);
  doc.text(`Fokus: ${activity.category}   •   Kelompok Usia: ${activity.ageGroup}   •   Estimasi: ${activity.estimatedTime}`, pageWidth / 2, 65, { align: 'center' });

  // Description
  let curY = 74;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Ringkasan Aktivitas:', marginX, curY);

  curY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const descLines = doc.splitTextToSize(activity.description, contentWidth);
  doc.text(descLines, marginX, curY);
  curY += descLines.length * 4.2 + 3;

  // Learning Objectives Box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(marginX, curY, contentWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(22, 101, 52);
  doc.text('🎯 Capaian Kompetensi Belajar (Learning Objectives):', marginX + 4, curY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(21, 128, 61);
  doc.text(`1. ${activity.learningGoals[0]}`, marginX + 6, curY + 11.5);
  doc.text(`2. ${activity.learningGoals[1]}`, marginX + 6, curY + 16.5);
  doc.text(`3. ${activity.learningGoals[2]}`, marginX + 6, curY + 21.5);

  curY += 31;

  // Tools & Materials
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, curY, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('✂️ Alat dan Bahan yang Diperlukan:', marginX + 4, curY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(activity.materials.join('   •   '), marginX + 6, curY + 10.5);

  curY += 19;

  // Instructions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('📌 Petunjuk Kerja Siswa & Panduan Pendamping:', marginX, curY);

  curY += 5;
  activity.instructions.forEach((inst, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(217, 119, 6);
    doc.text(`${idx + 1}.`, marginX + 2, curY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const instLines = doc.splitTextToSize(inst, contentWidth - 8);
    doc.text(instLines, marginX + 7, curY);
    curY += instLines.length * 3.8 + 2;
  });

  curY += 3;

  // Rubric & Assessment Table at bottom of Page 1
  const rubY = 222;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginX, rubY, contentWidth, 48, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('📋 RUBRIK PENILAIAN PENDAMPING (GURU / ORANG TUA):', marginX + 4, rubY + 6);

  // Rubric table headers
  doc.setFillColor(241, 245, 249);
  doc.rect(marginX + 4, rubY + 8.5, contentWidth - 8, 5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(marginX + 4, rubY + 8.5, contentWidth - 8, 5, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Aspek yang Dinilai', marginX + 6, rubY + 12);
  doc.text('Skala Bintang (1 - 5)', marginX + 70, rubY + 12);
  doc.text('Catatan Observasi Karakter', marginX + 115, rubY + 12);

  const criteria = [
    { title: '1. Pemahaman Algoritma & Urutan Langkah', stars: '[ ⭐ ⭐ ⭐ ⭐ ⭐ ]' },
    { title: '2. Ketelitian, Analisis & Kerapian Kerja', stars: '[ ⭐ ⭐ ⭐ ⭐ ⭐ ]' },
    { title: '3. Kemandirian, Pantang Menyerah & Rasa Ingin Tahu', stars: '[ ⭐ ⭐ ⭐ ⭐ ⭐ ]' },
  ];

  criteria.forEach((crit, ci) => {
    const cy = rubY + 14 + ci * 6.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text(crit.title, marginX + 6, cy + 4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(217, 119, 6);
    doc.text(crit.stars, marginX + 72, cy + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text('..................................................................', marginX + 115, cy + 4);
  });

  // Signature row
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Tanda Tangan Guru / Pembina: ______________________', marginX + 6, rubY + 42);
  doc.text('Tanda Tangan Orang Tua: ______________________', marginX + 100, rubY + 42);

  drawPageFooter(doc, 1, 2);

  // =========================================================================
  // PAGE 2: LEMBAR PRAKTIK UTAMA (FULL SIZED ACTIVITY WORKSPACE)
  // =========================================================================
  doc.addPage();
  drawPageHeader(doc, activity, 2, 2);

  let p2Y = 32;

  if (activity.printableType === 'maze') {
    // -------------------------------------------------------------
    // LKPD 1: LABIRIN KERTAS ALGORITMA (SPACIOUS & BEAUTIFULLY DRAWN)
    // -------------------------------------------------------------
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(marginX, p2Y, contentWidth, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 58, 138);
    doc.text('LEMBAR KERJA SISWA: GRID LABIRIN ALGORITMA 6x6 & TABEL KODE PERINTAH', pageWidth / 2, p2Y + 5.5, { align: 'center' });

    p2Y += 12;

    // Grid coordinates 6x6
    const gridStartX = marginX + 5;
    const gridStartY = p2Y + 6;
    const cellSize = 13.5; // mm (much larger and comfortable for children to draw in!)
    const cols = 6;
    const rows = 6;

    // Coordinate Row Labels (A - F)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach((lbl, r) => {
      doc.text(lbl, gridStartX - 4.5, gridStartY + r * cellSize + 9);
    });

    // Coordinate Column Labels (1 - 6)
    ['1', '2', '3', '4', '5', '6'].forEach((lbl, c) => {
      doc.text(lbl, gridStartX + c * cellSize + 5.5, gridStartY - 2.5);
    });

    // Draw cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = gridStartX + c * cellSize;
        const cy = gridStartY + r * cellSize;

        doc.setDrawColor(203, 213, 225);
        doc.setFillColor(255, 255, 255);

        // START (A1: r0, c0)
        if (r === 0 && c === 0) {
          doc.setFillColor(220, 252, 231);
          doc.rect(cx, cy, cellSize, cellSize, 'FD');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(21, 128, 61);
          doc.text('START', cx + cellSize / 2, cy + 5.5, { align: 'center' });
          doc.setFontSize(7);
          doc.text('🤖 ROBOT', cx + cellSize / 2, cy + 10, { align: 'center' });
        }
        // FINISH (F6: r5, c5)
        else if (r === 5 && c === 5) {
          doc.setFillColor(254, 243, 199);
          doc.rect(cx, cy, cellSize, cellSize, 'FD');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(180, 83, 9);
          doc.text('FINISH', cx + cellSize / 2, cy + 5.5, { align: 'center' });
          doc.setFontSize(7);
          doc.text('⚡ ENERGI', cx + cellSize / 2, cy + 10, { align: 'center' });
        }
        // Obstacle 1: Batu di B3 (r1, c2)
        else if (r === 1 && c === 2) {
          doc.setFillColor(226, 232, 240);
          doc.rect(cx, cy, cellSize, cellSize, 'FD');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(71, 85, 105);
          doc.text('🪨 BATU', cx + cellSize / 2, cy + 8, { align: 'center' });
        }
        // Obstacle 2: Air di D2 (r3, c1)
        else if (r === 3 && c === 1) {
          doc.setFillColor(224, 242, 254);
          doc.rect(cx, cy, cellSize, cellSize, 'FD');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(3, 105, 161);
          doc.text('💧 AIR', cx + cellSize / 2, cy + 8, { align: 'center' });
        }
        // Obstacle 3: Lubang di E5 (r4, c4)
        else if (r === 4 && c === 4) {
          doc.setFillColor(241, 245, 249);
          doc.rect(cx, cy, cellSize, cellSize, 'FD');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(15, 23, 42);
          doc.text('🕳️ LUBANG', cx + cellSize / 2, cy + 8, { align: 'center' });
        }
        // Bonus Star 1: C4 (r2, c3)
        else if (r === 2 && c === 3) {
          doc.setFillColor(254, 249, 195);
          doc.rect(cx, cy, cellSize, cellSize, 'FD');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(202, 138, 4);
          doc.text('⭐ KOIN 1', cx + cellSize / 2, cy + 8, { align: 'center' });
        }
        // Bonus Star 2: E3 (r4, c2)
        else if (r === 4 && c === 2) {
          doc.setFillColor(254, 249, 195);
          doc.rect(cx, cy, cellSize, cellSize, 'FD');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(202, 138, 4);
          doc.text('⭐ KOIN 2', cx + cellSize / 2, cy + 8, { align: 'center' });
        } else {
          doc.rect(cx, cy, cellSize, cellSize);
        }
      }
    }

    // Right side: Table of Commands
    const tableX = gridStartX + cols * cellSize + 8;
    const tableWidth = contentWidth - (cols * cellSize) - 13;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('TABEL PERINTAH ALGORITMA:', tableX, p2Y + 4);

    doc.setFillColor(241, 245, 249);
    doc.rect(tableX, p2Y + 6, tableWidth, 5.5, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(tableX, p2Y + 6, tableWidth, 5.5, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(51, 65, 85);
    doc.text('No.', tableX + 2.5, p2Y + 10);
    doc.text('Simbol Panah', tableX + 11, p2Y + 10);
    doc.text('Nama Perintah Aksi', tableX + 33, p2Y + 10);
    doc.text('Posisi Baru', tableX + 71, p2Y + 10);

    for (let s = 1; s <= 10; s++) {
      const sy = p2Y + 11.5 + (s - 1) * 7.5;
      doc.setDrawColor(226, 232, 240);
      doc.rect(tableX, sy, tableWidth, 7.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`${s}.`, tableX + 3, sy + 5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      doc.text('...........', tableX + 13, sy + 5);
      doc.text('.....................................', tableX + 33, sy + 5);
      doc.text('[     ,     ]', tableX + 72, sy + 5);
    }

    // Questions below the grid
    const qY = gridStartY + rows * cellSize + 10;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(marginX, qY, contentWidth, 52, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('💡 TANTANGAN REFLEKSI & ANALISIS ALGORITMA:', marginX + 4, qY + 6.5);

    const questions = [
      '1. Berapa total langkah paling sedikit yang kamu temukan untuk sampai ke FINISH? Jawab: _____ Langkah.',
      '2. Apakah robotmu berhasil mengambil kedua koin bintang emas (C4 & E3)?   [  ] Ya, Berhasil    [  ] Belum',
      '3. Jika jalan di koordinat C3 terhalang batu tambahan, rute lain mana yang bisa kamu pilih? ________________________',
      '4. Apa yang terjadi jika urutan perintah nomor 2 dan 3 tertukar posisinya? ___________________________________________',
      '5. Mengapa komputer membutuhkan urutan instruksi yang runtut (tidak boleh melompat-lompat)? _______________________'
    ];

    questions.forEach((q, qi) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(q, marginX + 6, qY + 13 + qi * 7.5);
    });

  } else if (activity.printableType === 'cards') {
    // -------------------------------------------------------------
    // LKPD 2: KARTU PERINTAH ROBOT CILIK (CUT & PASTE)
    // -------------------------------------------------------------
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(marginX, p2Y, contentWidth, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 58, 138);
    doc.text('LEMBAR KERJA SISWA: 12 KARTU PERINTAH (GUNTING & TEMPEL KE PAPAN ALUR)', pageWidth / 2, p2Y + 5.5, { align: 'center' });

    p2Y += 12;

    const cardLabels = [
      { t: 'PROGRAMMER CILIK', sub: 'Peran: Pemberi Kode', icon: '🧑‍💻' },
      { t: 'ROBOT PINTAR', sub: 'Peran: Pelaksana Aksi', icon: '🤖' },
      { t: '↑ MAJU 1 LANGKAH', sub: 'Gerak lurus ke depan', icon: '⬆️' },
      { t: '↑ MAJU 1 LANGKAH', sub: 'Gerak lurus ke depan', icon: '⬆️' },
      { t: '↓ MUNDUR 1 LANGKAH', sub: 'Mundur 1 kotak', icon: '⬇️' },
      { t: '↶ BELOK KIRI 90°', sub: 'Putar badan ke kiri', icon: '↺' },
      { t: '↷ BELOK KANAN 90°', sub: 'Putar badan ke kanan', icon: '↻' },
      { t: '⚡ LOMPAT TINGGI', sub: 'Hindari rintangan', icon: '🦘' },
      { t: '★ AMBIL BINTANG', sub: 'Koleksi poin emas', icon: '⭐' },
      { t: '🔄 ULANGI 2 KALI', sub: 'Looping aksi terakhir', icon: '🔁' },
      { t: '🛑 STOP & SELESAI', sub: 'Program berakhir aman', icon: '⏹' },
      { t: '🎉 SELEBRASI MENANG', sub: 'Tepuk tangan gembira', icon: '🎊' }
    ];

    const cardW = 42;
    const cardH = 26;
    for (let i = 0; i < 12; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const cx = marginX + 2 + col * (cardW + 3);
      const cy = p2Y + row * (cardH + 3.5);

      doc.setLineDashPattern([2, 1.5], 0);
      doc.setDrawColor(100, 116, 139);
      doc.setFillColor(250, 250, 250);
      doc.rect(cx, cy, cardW, cardH, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text('✂ gunting', cx + 3, cy + 4);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(cardLabels[i].t, cx + cardW / 2, cy + 12, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text(cardLabels[i].sub, cx + cardW / 2, cy + 18, { align: 'center' });
    }
    doc.setLineDashPattern([], 0);

    // Pasting area below
    const pasteY = p2Y + 3 * (cardH + 3.5) + 6;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(marginX, pasteY, contentWidth, 80, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('📌 PAPAN TEMPEL ALUR PROGRAM ROBOT (Tempelkan kartu hasil guntingan di bawah):', marginX + 4, pasteY + 6.5);

    const slotW = 27.5;
    const slotH = 26;
    for (let s = 1; s <= 6; s++) {
      const sx = marginX + 4 + (s - 1) * (slotW + 2.5);
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(sx, pasteY + 11, slotW, slotH, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`Slot #${s}`, sx + slotW / 2, pasteY + 19, { align: 'center' });
      doc.setFontSize(6.5);
      doc.text('[ Tempel Kartu ]', sx + slotW / 2, pasteY + 27, { align: 'center' });
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text('Catatan Programmer:', marginX + 4, pasteY + 45);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('1. Berapa kali kamu menemukan bug saat robot berjalan? Jawab: _____ kali bug.', marginX + 4, pasteY + 52);
    doc.text('2. Bagaimana cara kamu memperbaiki urutan kartu tersebut (Debugging)? _______________________________________', marginX + 4, pasteY + 59);
    doc.text('3. Apa tugas tersulit yang kamu berikan kepada si Robot? ____________________________________________________', marginX + 4, pasteY + 66);

  } else if (activity.printableType === 'binary') {
    // -------------------------------------------------------------
    // LKPD 3: GELANG KODE BINER (ASCII CHART & BEAD SIMULATION)
    // -------------------------------------------------------------
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(marginX, p2Y, contentWidth, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 58, 138);
    doc.text('LEMBAR KERJA SISWA: KAMUS BINER 8-BIT & POLA MANIK GELANG NAMA', pageWidth / 2, p2Y + 5.5, { align: 'center' });

    p2Y += 12;

    // Explainer
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text('Kamus Kode Biner Huruf Kapital (1 Byte = 8 Bit | 0 = Manik Biru/Mati, 1 = Manik Kuning/Hidup):', marginX, p2Y + 4);

    const asciiTable = [
      'A: 01000001', 'B: 01000010', 'C: 01000011', 'D: 01000100', 'E: 01000101', 'F: 01000110', 'G: 01000111',
      'H: 01001000', 'I: 01001001', 'J: 01001010', 'K: 01001011', 'L: 01001100', 'M: 01001101', 'N: 01001110',
      'O: 01001111', 'P: 01010000', 'Q: 01010001', 'R: 01010010', 'S: 01010011', 'T: 01010100', 'U: 01010101',
      'V: 01010110', 'W: 01010111', 'X: 01011000', 'Y: 01011001', 'Z: 01011010', 'SPASI: 00100000', '!: 00100001'
    ];

    doc.setFillColor(248, 250, 252);
    doc.rect(marginX, p2Y + 7, contentWidth, 27, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginX, p2Y + 7, contentWidth, 27, 'D');

    asciiTable.forEach((item, idx) => {
      const col = idx % 7;
      const row = Math.floor(idx / 7);
      const px = marginX + 3 + col * 25.5;
      const py = p2Y + 12.5 + row * 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(30, 41, 59);
      doc.text(item, px, py);
    });

    // Student Conversion Table
    p2Y += 39;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Tabel Pemecahan Nama Kamu ke Kode Biner 8-Bit:', marginX, p2Y + 4);

    doc.setFillColor(241, 245, 249);
    doc.rect(marginX, p2Y + 7, contentWidth, 6, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(marginX, p2Y + 7, contentWidth, 6, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text('No.', marginX + 3, p2Y + 11.2);
    doc.text('Huruf', marginX + 16, p2Y + 11.2);
    doc.text('Kode Biner 8-Bit (0 dan 1)', marginX + 36, p2Y + 11.2);
    doc.text('Simulasi Warna Manik (Beri Warna: B = Biru, K = Kuning)', marginX + 90, p2Y + 11.2);

    for (let r = 1; r <= 6; r++) {
      const ry = p2Y + 13 + (r - 1) * 9.5;
      doc.setDrawColor(226, 232, 240);
      doc.rect(marginX, ry, contentWidth, 9.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Huruf ${r}`, marginX + 3, ry + 6);
      doc.text('[     ]', marginX + 16, ry + 6);
      doc.text('[   |   |   |   |   |   |   |   ]', marginX + 36, ry + 6);

      // 8 larger circular beads
      for (let b = 0; b < 8; b++) {
        doc.setDrawColor(203, 213, 225);
        doc.circle(marginX + 96 + b * 9.5, ry + 4.8, 3.2);
      }
    }

    // Secret Challenge Box
    p2Y += 76;
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(251, 191, 36);
    doc.roundedRect(marginX, p2Y, contentWidth, 32, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(180, 83, 9);
    doc.text('🕵️ TANTANGAN DEKRIPSI PESAN RAHASIA KOMPUTER:', marginX + 4, p2Y + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Tebak kata apakah ini? Cocokkan dengan tabel kamus biner di atas:', marginX + 4, p2Y + 12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('[01001011]   [01001111]   [01000100]   [01001001]   [01001110]   [01000111]', marginX + 4, p2Y + 18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text('Hasil Terjemahan Kata Rahasia : ____________________________________________________', marginX + 4, p2Y + 26);

  } else {
    // -------------------------------------------------------------
    // LKPD 4: DETEKTIF POLA & LOGIKA (COMPUTATIONAL THINKING)
    // -------------------------------------------------------------
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(marginX, p2Y, contentWidth, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 58, 138);
    doc.text('LEMBAR KERJA SISWA: 5 TANTANGAN DETEKTIF LOGIKA, POLA & PERCABANGAN IF-ELSE', pageWidth / 2, p2Y + 5.5, { align: 'center' });

    p2Y += 12;

    // Challenge 1
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('1. Pola Bentuk Berulang (Looping):', marginX, p2Y + 4);
    doc.setFont('helvetica', 'normal');
    doc.text('   Lingkaran  ->  Segitiga  ->  Kotak  ->  Lingkaran  ->  Segitiga  ->  [  ?  ]', marginX, p2Y + 9);
    doc.text('   Jawaban bentuk berikutnya: ___________________  (Aturan perulangan: __________________________________)', marginX, p2Y + 14.5);

    // Challenge 2
    p2Y += 21;
    doc.setFont('helvetica', 'bold');
    doc.text('2. Pola Deret Angka Bertambah (Algoritma Penjumlahan Konstan):', marginX, p2Y + 4);
    doc.setFont('helvetica', 'normal');
    doc.text('   3  ->  6  ->  9  ->  12  ->  15  ->  [  ?  ]  ->  [  ?  ]', marginX, p2Y + 9);
    doc.text('   Dua angka selanjutnya adalah: _____ dan _____  (Aturan penambahan: Ditambah angka _____)', marginX, p2Y + 14.5);

    // Challenge 3
    p2Y += 21;
    doc.setFont('helvetica', 'bold');
    doc.text('3. Sequencing Kehidupan Nyata (Urutan Logika Membuat Es Jeruk Segar):', marginX, p2Y + 4);
    doc.setFont('helvetica', 'normal');
    doc.text('   Beri nomor 1 sampai 4 pada kotak di bawah untuk mengurutkan langkah yang benar:', marginX, p2Y + 9);
    doc.text('   [   ] Peras buah jeruk ke dalam gelas              [   ] Tambahkan es batu dan air matang', marginX, p2Y + 14.5);
    doc.text('   [   ] Siapkan jeruk manis dan gelas bersih          [   ] Beri sedikit gula dan aduk rata', marginX, p2Y + 20);

    // Challenge 4
    p2Y += 27;
    doc.setFont('helvetica', 'bold');
    doc.text('4. Logika Percabangan Syarat (IF - ELSE / JIKA - MAKA):', marginX, p2Y + 4);
    doc.setFont('helvetica', 'normal');
    doc.text('   "JIKA sisa baterai robot kurang dari 20%, MAKA robot harus berhenti dan mencari stasiun charger.', marginX, p2Y + 9);
    doc.text('    SELAIN ITU (ELSE), robot boleh terus berjalan menjelajahi labirin."', marginX, p2Y + 14);
    doc.text('   Kondisi Soal: Saat ini baterai robot menunjukkan angka 14%.', marginX, p2Y + 19);
    doc.text('   Apa keputusan yang harus diambil oleh robot? _________________________________________________________', marginX, p2Y + 24.5);

    // Challenge 5
    p2Y += 31;
    doc.setFont('helvetica', 'bold');
    doc.text('5. Rancang Pola Rahasiamu Sendiri:', marginX, p2Y + 4);
    doc.setFont('helvetica', 'normal');
    doc.text('   Gambarlah 4 bentuk atau warna buatanmu: [       ] -> [       ] -> [       ] -> [       ] -> [   ?   ]', marginX, p2Y + 9.5);
    doc.text('   Uji teman atau orang tuamu untuk menebak bentuk di kotak tanda tanya [ ? ] !', marginX, p2Y + 15);
  }

  drawPageFooter(doc, 2, 2);

  // Save PDF
  doc.save(`${activity.docCode}-${activity.id}.pdf`);
}
