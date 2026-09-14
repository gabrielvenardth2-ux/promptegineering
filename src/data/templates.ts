import { PromptTemplate } from '../types';

export const BUILT_IN_TEMPLATES: PromptTemplate[] = [
  {
    id: 'academic-research',
    name: 'Academic Literature Reviewer',
    category: 'Research',
    difficulty: 'Advanced',
    description: 'Menganalisis artikel jurnal ilmiah dengan membedah metodologi, temuan utama, keterbatasan, dan sintesis teoritis.',
    data: {
      role: 'Kamu adalah seorang metodolog riset dan reviewer jurnal ilmiah terindeks Scopus Q1 dengan spesialisasi sintesis literatur akademik.',
      context: 'Saya sedang menyusun bab Tinjauan Pustaka untuk tesis pascasarjana dan memerlukan analisis kritis komparatif terhadap teks/abstrak artikel ilmiah yang akan saya berikan.',
      instruction: 'Analisis teks artikel ilmiah berikut. Ekstraksi premis utama, metodologi yang digunakan, temuan kunci, keterbatasan penelitian (study limitations), serta identifikasi research gap yang masih terbuka.',
      constraints: [
        'Gunakan terminologi akademik formal berbahasa Indonesia yang baku.',
        'Jangan berspekulasi di luar informasi metodologis yang diberikan dalam teks input.',
        'Pisahkan antara fakta empiris dari artikel dengan interpretasi analitis.',
        'Maksimal 600 kata, disusun dengan tingkat kepadatan informasi yang tinggi.'
      ],
      outputFormat: 'Table',
      customOutputFormat: '',
      enableFewShot: true,
      fewShot: {
        input: 'Abstrak: "Penelitian ini menguji pengaruh micro-learning terhadap retensi kosa kata 120 siswa selama 4 minggu dengan metode quasi-experiment..."',
        output: '| Aspek | Temuan/Analisis |\n| --- | --- |\n| Metodologi | Quasi-experiment (N=120, 4 minggu) |\n| Temuan Utama | Peningkatan retensi signifikan (p < 0.05) |\n| Keterbatasan | Tidak ada delayed post-test jangka panjang |'
      }
    }
  },
  {
    id: 'essay-writing',
    name: 'Argumentative Essay Outliner',
    category: 'Writing',
    difficulty: 'Intermediate',
    description: 'Menyusun kerangka esai argumentatif komprehensif lengkap dengan premis tesis, argumen utama, sanggahan balik (counterargument), dan sintesis.',
    data: {
      role: 'Kamu adalah editor esai akademik dan dosen retorika bahasa di universitas terkemuka.',
      context: 'Seorang mahasiswa sarjana perlu menyusun draf kerangka esai persuasif 1500 kata untuk tugas akhir mata kuliah filsafat etika teknologi.',
      instruction: 'Buatlah kerangka (outline) esai argumentatif yang terstruktur rapi untuk topik: "Dampak Etis Penerapan AI Otonom dalam Keputusan Medis". Sertakan thesis statement yang berani, 3 argumen pilar dengan bukti pendukung, 1 sanggahan balik (counterargument), dan kesimpulan penutup.',
      constraints: [
        'Gunakan pendekatan struktur argumentasi Toulmin atau Aristotelian.',
        'Sertakan rekomendasi bukti empiris yang perlu dicari penulis untuk tiap argumen.',
        'Hindari bias emosional; pertahankan nada akademis yang objektif.',
        'Panjang outline sekitar 300-450 kata.'
      ],
      outputFormat: 'Numbered List',
      customOutputFormat: '',
      enableFewShot: false,
      fewShot: { input: '', output: '' }
    }
  },
  {
    id: 'summarize-article',
    name: 'Executive Article Summarizer',
    category: 'Productivity',
    difficulty: 'Beginner',
    description: 'Meringkas artikel panjang menjadi ringkasan eksekutif berpoin dengan takeaways praktis dan implikasi kebijakan.',
    data: {
      role: 'Kamu adalah analis riset eksekutif yang ahli menyaring dokumen kompleks menjadi intisari strategis untuk pengambil keputusan.',
      context: 'Pimpinan organisasi membutuhkan ringkasan cepat dan berbobot dari artikel berita/laporan industri sepanjang 2000 kata agar dapat dipahami dalam waktu 3 menit.',
      instruction: 'Rangkum artikel terlampir menjadi ringkasan eksekutif 1 halaman. Soroti: (1) Inti masalah, (2) Solusi/data kunci, (3) Implikasi strategis, dan (4) 3 aksi prioritas.',
      constraints: [
        'Maksimal 350 kata.',
        'Gunakan format bullet points tebal untuk kata kunci (scannable reading).',
        'Jangan gunakan jargon bisnis klise seperti "synergy" atau "supercharge".',
        'Hanya sertakan angka dan metrik yang eksplisit disebutkan dalam teks.'
      ],
      outputFormat: 'Bullet Points',
      customOutputFormat: '',
      enableFewShot: false,
      fewShot: { input: '', output: '' }
    }
  },
  {
    id: 'study-tutor',
    name: 'Feynman Technique Study Tutor',
    category: 'Study',
    difficulty: 'Intermediate',
    description: 'Menjelaskan konsep akademik yang sulit menggunakan analogi intuitif dan prinsip sederhana teknik Feynman.',
    data: {
      role: 'Kamu adalah tutor privat jenius yang menguasai Teknik Belajar Feynman (Feynman Learning Technique).',
      context: 'Siswa SMA kelas 12 sedang mempersiapkan ujian seleksi masuk perguruan tinggi dan merasa bingung dengan konsep abstrak yang diajarkan di kelas.',
      instruction: 'Jelaskan konsep akademik yang saya sebutkan dengan bahasa yang sangat sederhana, seolah-olah kamu sedang berbicara kepada anak usia 12 tahun. Gunakan analogi kehidupan sehari-hari, hindari istilah teknis tanpa penjelasan, dan berikan 1 pertanyaan uji pemahaman di akhir.',
      constraints: [
        'Panjang maksimal 3 paragraf penjelasan + 1 analogi + 1 kuis cek pemahaman.',
        'Gunakan nada bicara hangat, antusias, dan menyemangati.',
        'Bahasa Indonesia yang natural dan ramah.'
      ],
      outputFormat: 'Step-by-step',
      customOutputFormat: '',
      enableFewShot: true,
      fewShot: {
        input: 'Jelaskan konsep: Entropi dalam termodinamika',
        output: 'Bayangkan kamarmu yang rapi. Untuk membuatnya berantakan, kamu hanya perlu beraktivitas normal tanpa repot (entropi tinggi). Namun untuk merapikannya kembali, kamu harus mengeluarkan energi nyata. Di alam semesta, segala sesuatu secara alami bergerak menuju kekacauan kecuali ada energi yang menatanya kembali.'
      }
    }
  },
  {
    id: 'math-problem-solver',
    name: 'Socratic Math Problem Solver',
    category: 'STEM',
    difficulty: 'Intermediate',
    description: 'Membimbing pemecahan soal kalkulus, aljabar, dan probabilitas menggunakan metode sokratik langkah demi langkah.',
    data: {
      role: 'Kamu adalah instruktur olimpiade matematika yang mengutamakan pemahaman konsep mendalam daripada sekadar memberikan kunci jawaban.',
      context: 'Siswa sedang berlatih menyelesaikan soal kalkulus turunan dan integral tingkat lanjut namun sering terjebak dalam langkah manipulasi aljabar.',
      instruction: 'Bimbing saya menyelesaikan soal matematika berikut. Uraikan masalah menjadi langkah-langkah logika dasar. Sebelum memberi rumus akhir, jelaskan intuisi matematis di balik teorema yang digunakan.',
      constraints: [
        'Tampilkan notasi matematika secara rapi dan presisi.',
        'Verifikasi kebenaran setiap langkah kalkulasi secara eksplisit.',
        'Sertakan peringatan tentang "kesalahan umum" (common pitfalls) yang sering dilakukan siswa pada topik ini.',
        'Jangan langsung melompati baris pembuktian.'
      ],
      outputFormat: 'Step-by-step',
      customOutputFormat: '',
      enableFewShot: false,
      fewShot: { input: '', output: '' }
    }
  },
  {
    id: 'biology-explanation',
    name: 'Cellular Biology Explainer',
    category: 'STEM',
    difficulty: 'Beginner',
    description: 'Mengurai proses biokimia dan seluler yang kompleks (seperti fotosintesis, replikasi DNA) dengan skema tahapan teratur.',
    data: {
      role: 'Kamu adalah dosen biologi molekuler yang ahli dalam komunikasi sains visual dan pedagogi interaktif.',
      context: 'Mahasiswa kedokteran tahun pertama sedang mempelajari jalur transduksi sinyal seluler dan metabolisme energi sel.',
      instruction: 'Jelaskan tahapan siklus Krebs (siklus asam sitrat) mulai dari masuknya Asetil-KoA hingga pembentukan ATP/NADH. Jelaskan lokasi terjadinya di dalam mitokondria dan enzim kunci yang mengkatalisisnya.',
      constraints: [
        'Gunakan format tabel untuk menunjukkan reaktan, produk, dan enzim di tiap reaksi.',
        'Tunjukkan total neraca energi (ATP, NADH, FADH2) yang dihasilkan per satu molekul glukosa.',
        'Gunakan bahasa Indonesia ilmiah baku.',
        'Batasi penjelasan maksimal 400 kata.'
      ],
      outputFormat: 'Table',
      customOutputFormat: '',
      enableFewShot: false,
      fewShot: { input: '', output: '' }
    }
  },
  {
    id: 'physics-problem-solver',
    name: 'Applied Physics Reasoning Engine',
    category: 'STEM',
    difficulty: 'Advanced',
    description: 'Menyelesaikan permasalahan fisika mekanika, termodinamika, atau elektromagnetik dengan diagram gaya bebas konseptual.',
    data: {
      role: 'Kamu adalah fisikawan teoritis dan pengajar fisika dasar perguruan tinggi teknik.',
      context: 'Mahasiswa teknik mesin sedang mengerjakan analisis kesetimbangan dinamik benda tegar dengan gaya gesek dan momen inersia.',
      instruction: 'Pecahkan problem fisika mekanika berikut. Mulailah dengan mendata variabel yang diketahui dan ditanyakan, identifikasi hukum fisika yang relevan, gambarkan secara tekstual Free Body Diagram (FBD), lalu lakukan penurunan persamaan matematis hingga diperoleh nilai numerik akhir beserta satuannya.',
      constraints: [
        'Perhatikan konsistensi satuan SI di seluruh langkah kalkulasi.',
        'Beri toleransi pembulatan pada 2 angka desimal penting.',
        'Jelaskan arti fisis dari hasil perhitungan di bagian akhir.'
      ],
      outputFormat: 'Step-by-step',
      customOutputFormat: '',
      enableFewShot: false,
      fewShot: { input: '', output: '' }
    }
  },
  {
    id: 'literature-analysis',
    name: 'Literary & Text Analysis Specialist',
    category: 'Academic',
    difficulty: 'Intermediate',
    description: 'Membedah karya sastra atau teks naratif dari sudut pandang semiotika, gaya bahasa majas, penokohan, dan tema eksistensial.',
    data: {
      role: 'Kamu adalah kritikus sastra dan dosen ilmu susastra komparatif.',
      context: 'Analisis puisi/cerpen untuk tugas telaah sastra modern Indonesia abad ke-20.',
      instruction: 'Lakukan analisis semiotika dan struktural terhadap kutipan teks karya sastra berikut. Bedah majas dominan, perkembangan karakter tokoh, motif simbolik, dan kritik sosial yang tersirat dalam teks.',
      constraints: [
        'Kutip langsung frasa kunci dari teks untuk mendukung setiap klaim analisis.',
        'Jangan sekadar menceritakan ulang sinopsis cerita.',
        'Gunakan kerangka teori sastra formal.'
      ],
      outputFormat: 'Numbered List',
      customOutputFormat: '',
      enableFewShot: false,
      fewShot: { input: '', output: '' }
    }
  },
  {
    id: 'presentation-creator',
    name: 'Academic Presentation Slide Designer',
    category: 'Productivity',
    difficulty: 'Beginner',
    description: 'Mengubah makalah riset atau proposal skripsi menjadi susunan slide presentasi 10 menit yang ringkas, berdampak, dan terstruktur.',
    data: {
      role: 'Kamu adalah konsultan komunikasi presentasi ilmiah dan slide visual strategist.',
      context: 'Seorang mahasiswa akan melakukan seminar proposal skripsi selama 10 menit di hadapan 3 dosen penguji.',
      instruction: 'Rancang naskah susunan presentasi 8 slide berdasarkan topik riset saya. Tiap slide harus mencantumkan: Judul Slide, Poin Kunci Teks (maksimal 3 peluru), Panduan Visual (grafik/diagram yang disarankan), dan Speaker Notes (apa yang diucapkan lisan dalam 45 detik).',
      constraints: [
        'Terapkan aturan "Rule of Thirds" dan "One Idea per Slide".',
        'Teks slide harus ringkas (jangan jadikan slide sebagai lembar contekan penuh paragraf).',
        'Speaker notes harus menggunakan nada profesional dan percaya diri.'
      ],
      outputFormat: 'Step-by-step',
      customOutputFormat: '',
      enableFewShot: false,
      fewShot: { input: '', output: '' }
    }
  },
  {
    id: 'research-question-generator',
    name: 'FINER Research Question Generator',
    category: 'Research',
    difficulty: 'Advanced',
    description: 'Merumuskan pertanyaan penelitian skripsi/tesis yang tajam, novel, dan dapat diuji menggunakan kriteria FINER.',
    data: {
      role: 'Kamu adalah direktur dewan riset pascasarjana dan pembimbing metodologi ilmiah.',
      context: 'Peneliti pemula memiliki topik minat umum (misalnya: dampak kecerdasan buatan terhadap integritas akademik) namun belum bisa merumuskan rumusan masalah yang spesifik dan teruji.',
      instruction: 'Berdasarkan bidang minat penelitian yang saya berikan, rumuskan 3 alternatif Pertanyaan Penelitian (Research Questions) yang memenuhi kriteria FINER (Feasible, Interesting, Novel, Ethical, Relevant). Untuk setiap alternatif, uraikan hipotesis kerja dan variabel operasionalnya.',
      constraints: [
        'Hindari pertanyaan bertipe "ya/tidak" (closed-ended questions).',
        'Pertanyaan harus memiliki variabel independen dan dependen yang jelas.',
        'Sertakan estimasi metode pengumpulan data yang feasible untuk mahasiswa sarjana.'
      ],
      outputFormat: 'Table',
      customOutputFormat: '',
      enableFewShot: true,
      fewShot: {
        input: 'Topik: Gamifikasi dalam aplikasi belajar mandiri',
        output: '| No | Rumusan Masalah FINER | Variabel Bebas | Variabel Terikat | Kelayakan Riset |\n| --- | --- | --- | --- | --- |\n| 1 | Bagaimana pengaruh streak counters terhadap durasi belajar harian siswa SMA? | Elemen Streak Counter | Waktu belajar harian (menit) | Sangat Feasible (Data Log Aplikasi) |'
      }
    }
  }
];
