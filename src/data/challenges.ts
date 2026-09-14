import { PromptChallenge } from '../types';

export const PROMPT_CHALLENGES: PromptChallenge[] = [
  {
    id: 'challenge-1',
    title: 'Perancang Jadwal Belajar Siswa SMA Menjelang Ujian',
    scenario: 'Kamu harus merancang prompt yang meminta AI menyusun jadwal belajar mingguan yang realistis dan ramah beban kognitif untuk seorang siswa SMA kelas 12 yang sedang bersiap menghadapi ujian masuk perguruan tinggi.',
    targetRole: 'Tutor akademik spesialis manajemen waktu dan psikologi belajar siswa.',
    hints: [
      'Tentukan batas jam belajar harian dan waktu istirahat (Teknik Pomodoro).',
      'Minta jadwal disusun dalam format tabel harian (Senin - Minggu).',
      'Batasi agar AI tidak membuat jadwal ekstrem tanpa tidur atau rekreasi.'
    ],
    difficulty: 'Mudah'
  },
  {
    id: 'challenge-2',
    title: 'Analisis Dampak Mikroplastik bagi Ekosistem Pesisir',
    scenario: 'Kamu membutuhkan sintesis kritis dari AI mengenai bagaimana partikel mikroplastik berpindah dari air laut ke biota laut hingga ke rantai makanan manusia.',
    targetRole: 'Ahli biologi kelautan dan toksikologi lingkungan.',
    hints: [
      'Gunakan batasan untuk hanya menyertakan temuan yang didukung literatur peer-reviewed.',
      'Minta format output dengan alur sebab-akibat (causal chain step-by-step).',
      'Sertakan batasan panjang maksimal 400 kata.'
    ],
    difficulty: 'Menengah'
  },
  {
    id: 'challenge-3',
    title: 'Tutor Algoritma: Pemahaman Rekursi untuk Pemula',
    scenario: 'Siswa kelas pemrograman dasar kesulitan memahami konsep rekursi fungsi dalam ilmu komputer. Buat prompt agar AI menjelaskannya dengan analogi visual intuitif tanpa rumus rumit.',
    targetRole: 'Pengajar ilmu komputer ramah yang menguasai pedagogi visual.',
    hints: [
      'Instruksikan AI menggunakan analogi nyata (seperti boneka bersarang Rusia Matryoshka atau cermin berhadapan).',
      'Wajibkan adanya penjelasan "Base Case" (kondisi berhenti) agar tidak infinite loop.',
      'Sediakan 1 contoh potongan kode sederhana 5 baris.'
    ],
    difficulty: 'Mudah'
  },
  {
    id: 'challenge-4',
    title: 'Analisis Komparatif Sejarah: Taktik Perang Gerilya',
    scenario: 'Bandingkan strategi taktik perang gerilya Pangeran Diponegoro (1825-1830) dengan Perang Gerilya Jenderal Sudirman (1948-1949).',
    targetRole: 'Sejarawan militer dan akademisi studi pertahanan Indonesia.',
    hints: [
      'Minta perbandingan disajikan dalam tabel komparasi multidimensi (Geografis, Logistik, Dukungan Rakyat).',
      'Batasi analisis agar objektif dan berbasis historiografi resmi.',
      'Tambahkan kesimpulan sintesis tentang prinsip adaptasi medan.'
    ],
    difficulty: 'Menengah'
  },
  {
    id: 'challenge-5',
    title: 'Simulasi Debat Kritis: Etika Kecerdasan Buatan dalam Seni',
    scenario: 'Rancang prompt yang meminta AI menyajikan argumen pro dan kontra yang berimbang mengenai perlindungan hak cipta seniman visual terhadap model AI generatif (seperti model image generation).',
    targetRole: 'Pakar hukum kekayaan intelektual (HAKI) dan etika teknologi informasi.',
    hints: [
      'Batasi agar AI tidak memihak satu sudut pandang (netralitas ketat).',
      'Format output berupa perbandingan dua sisi poin demi poin.',
      'Sertakan 1 rekomendasi regulasi kompromis di bagian akhir.'
    ],
    difficulty: 'Tantangan'
  }
];
