import { LevelInfo } from '../types';

export const CURRICULUM_LEVELS: LevelInfo[] = [
  {
    id: 1,
    title: 'Drag and Drop',
    subtitle: 'Gerakkan Blok Kode & Latih Motorik',
    iconName: 'HandMetal',
    color: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-300',
    stages: [
      {
        id: 1,
        title: 'Stage 1: Langkah Pertama Si Robot',
        description: 'Tarik blok [MAJU] ke dalam slot perintah untuk menggerakkan robot mengambil koin emas.',
        xpReward: 50,
        hint: 'Seret blok biru bertuliskan MAJU ke kotak target bertanda titik-titik.'
      },
      {
        id: 2,
        title: 'Stage 2: Belok Menuju Permata',
        description: 'Robot harus berbelok! Pasang blok [PUTAR KANAN] lalu sambung dengan [MAJU].',
        xpReward: 75,
        hint: 'Urutkan: pertama putar badan robot ke arah permata, lalu maju 1 langkah.'
      },
      {
        id: 3,
        title: 'Stage 3: Menembus Jalur Zig-Zag',
        description: 'Susun 4 kombinasi blok untuk melewati rintangan batu dan membuka peti harta karun.',
        xpReward: 100,
        hint: 'Perhatikan jalur: Maju -> Putar Kiri -> Maju -> Ambil Kunci!'
      }
    ]
  },
  {
    id: 2,
    title: 'Scrolling Navigasi',
    subtitle: 'Jelajahi Labirin Layar Menggulir',
    iconName: 'Compass',
    color: 'from-emerald-400 to-teal-600',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    stages: [
      {
        id: 1,
        title: 'Stage 1: Menyelam ke Dasar Samudra Data',
        description: 'Gunakan scroll (gulir layar mouse / sentuhan jari) untuk mengarahkan kapal selam melewati karang dan menemukan 3 mutiara kode.',
        xpReward: 60,
        hint: 'Gulir perlahan ke bawah untuk melihat mutiara yang bersembunyi.'
      },
      {
        id: 2,
        title: 'Stage 2: Menembus Menara Labirin Vertikal',
        description: 'Gulir naik dan turun untuk mengumpulkan 3 kristal energi sebelum pintu teleportasi tertutup.',
        xpReward: 80,
        hint: 'Perhatikan indikator kedalaman di sebelah kanan layar.'
      },
      {
        id: 3,
        title: 'Stage 3: Pemburu Kode Rahasia Gulir',
        description: 'Temukan 3 fragmen kata sandi yang tersebar di titik koordinat scroll tertentu.',
        xpReward: 110,
        hint: 'Gulir sampai meteran target menunjukkan zona hijau!'
      }
    ]
  },
  {
    id: 3,
    title: 'Mengetik Kode Cilik',
    subtitle: 'Ketik Perintah dengan Keyboard Ceria',
    iconName: 'Keyboard',
    color: 'from-blue-400 to-indigo-600',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-300',
    stages: [
      {
        id: 1,
        title: 'Stage 1: Perintah Kata Ajaib',
        description: 'Ketik kata-kata kode dasar seperti [MAJU], [STOP], dan [LARI] menggunakan keyboard visual atau keyboard fisikmu.',
        xpReward: 70,
        hint: 'Tekan tombol huruf berwarna cerah di layar atau ketik langsung dari keyboard.'
      },
      {
        id: 2,
        title: 'Stage 2: Memanggil Fungsi Robot',
        description: 'Ketik sintaks fungsi pemrograman sungguhan: JUMP() dan BEEP(). Melatih tanda kurung dan simbol.',
        xpReward: 90,
        hint: 'Ingat tambahkan tanda kurung buka "(" dan tutup ")".'
      },
      {
        id: 3,
        title: 'Stage 3: Mantra Algoritma Kilat',
        description: 'Ketik baris perintah kombinasi: IF (KOSONG) MAJU() secara tepat untuk melewati jurang.',
        xpReward: 120,
        hint: 'Perhatikan huruf besar dan spasi saat mengetik.'
      }
    ]
  },
  {
    id: 4,
    title: 'Computational Thinking',
    subtitle: 'Asah Logika, Pola & Pengurutan',
    iconName: 'Brain',
    color: 'from-purple-400 to-pink-600',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-300',
    stages: [
      {
        id: 1,
        title: 'Stage 1: Detektif Pola Warna',
        description: 'Tebak elemen berikutnya pada rangkaian pola: Merah -> Kuning -> Merah -> Kuning -> ?',
        xpReward: 80,
        hint: 'Cari tahu urutan yang selalu berulang sama (konsep Looping).'
      },
      {
        id: 2,
        title: 'Stage 2: Algoritma Menyiapkan Robot',
        description: 'Urutkan 4 langkah logis: [Isi Baterai], [Nyalakan Saklar], [Muat Program], [Mulai Berjalan].',
        xpReward: 100,
        hint: 'Langkah apa yang mutlak harus dilakukan paling awal?'
      },
      {
        id: 3,
        title: 'Stage 3: Logika Percabangan (IF-ELSE)',
        description: 'Bantu robot memutuskan: "JIKA jalan banjir, MAKA naik perahu. JIKA jalan kering, MAKA naik sepeda".',
        xpReward: 130,
        hint: 'Periksa kondisi cuaca sebelum memilih kendaraan yang cocok.'
      }
    ]
  },
  {
    id: 5,
    title: 'Project Sandbox Mandiri',
    subtitle: 'Gabungkan Semua Logika & Buat Karyamu!',
    iconName: 'Sparkles',
    color: 'from-rose-400 to-red-500',
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-300',
    stages: [
      {
        id: 1,
        title: 'Stage 1: Tarian Si Kucing Coding',
        description: 'Buat urutan animasi tari 3 langkah: Lompat -> Berputar -> Bunyikan Suara!',
        xpReward: 100,
        hint: 'Tambahkan blok aksi ke area timeline program lalu klik tombol JALANKAN.'
      },
      {
        id: 2,
        title: 'Stage 2: Menggambar Persegi Ajaib',
        description: 'Gunakan perintah Maju dan Belok 90° sebanyak 4 kali untuk melukis bentuk geometri persegi di panggung.',
        xpReward: 120,
        hint: '4 sisi sama panjang dengan 4 kali belokan ke kanan membentuk kotak sempurna!'
      },
      {
        id: 3,
        title: 'Stage 3: Master Sandbox Bebas',
        description: 'Ciptakan pertunjukan animasi impianmu sendiri! Bebas kombinasikan warna, gerakan, suara, dan kecepatan.',
        xpReward: 150,
        hint: 'Eksplorasi semua blok aksi dan saksikan robot menari sesuai rancanganmu!'
      }
    ]
  }
];
