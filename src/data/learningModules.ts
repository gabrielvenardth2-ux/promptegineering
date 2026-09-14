import { LearningModule } from '../types';

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 1,
    title: 'Module 1: What is a Prompt?',
    concept: 'Dasar Pemikiran Komputasional Model Bahasa',
    summary: 'Prompt bukan sekadar kotak pencarian seperti Google, melainkan instruksi pemrograman bahasa alami yang mengkondisikan distribusi probabilitas kata dari Large Language Model (LLM). Kualitas instruksi berbanding lurus dengan ketepatan hasil.',
    badExample: 'Jelaskan revolusi industri.',
    betterExample: 'Jelaskan 3 faktor utama pemicu Revolusi Industri Pertama di Inggris pada abad ke-18, khususnya dampak inovasi mesin uap terhadap efisiensi manufaktur tekstil.',
    improvementReason: 'Contoh buruk memicu jawaban ensiklopedis acak dan dangkal. Contoh yang baik membatasi cakupan historis (abad 18, Inggris), sektor spesifik (tekstil), dan mekanisme kausal (mesin uap).',
    keyTakeaway: 'Kekuatan sebuah prompt terletak pada delimitasi ruang pencarian informasi AI.',
    quiz: {
      question: 'Mengapa instruksi yang terlalu umum seperti "Jelaskan AI" sering menghasilkan respon yang mengecewakan?',
      options: [
        'Karena server LLM kekurangan daya komputasi.',
        'Karena ruang kemungkinan jawaban terlalu luas sehingga model memilih jawaban rata-rata yang klise.',
        'Karena AI menolak menjawab topik yang luas.',
        'Karena AI memerlukan query SQL untuk dapat bekerja.'
      ],
      correctIndex: 1,
      explanation: 'Benar! LLM bekerja dengan probabilitas kelanjutan teks. Jika tidak ada pembatas arah yang presisi, model akan menghasilkan ringkasan paling umum dan membosankan dari data pelatihannya.'
    }
  },
  {
    id: 2,
    title: 'Module 2: Role Prompting',
    concept: 'Persona Priming & Kalibrasi Kosakata',
    summary: 'Dengan memberikan peran (persona) spesifik, Anda menginstruksikan model untuk mengadopsi basis pengetahuan, jargon terminologi, dan nada bicara dari pakar bidang tertentu.',
    badExample: 'Bagaimana cara mengatasi demam anak?',
    betterExample: 'Kamu adalah dokter spesialis anak (pediatrik) berbasis bukti ilmiah yang terbiasa mengedukasi orang tua muda dengan bahasa yang tenang dan empatik. Jelaskan pertolongan pertama penanganan demam anak usia 3 tahun.',
    improvementReason: 'Role memberikan otoritas epistemik, memilihkan register bahasa yang tepat (medis ramah), dan menyaring mitos-mitos non-medis.',
    keyTakeaway: 'Role berfungsi sebagai lensa fokus untuk menentukan kedalaman dan nada respons AI.',
    quiz: {
      question: 'Manakah peran (Role) yang paling efektif untuk membedah data sensus penduduk?',
      options: [
        'Kamu adalah orang yang pintar di komputer.',
        'Kamu adalah asisten yang baik hati.',
        'Kamu adalah demografer senior dan analis data statistik Badan Pusat Statistik.',
        'Jawablah seperti robot yang tidak memiliki perasaan.'
      ],
      correctIndex: 2,
      explanation: 'Tepat! Otoritas keilmuan spesifik ("demografer senior dan analis data statistik") langsung mengaktifkan pemahaman metodologi demografi formal.'
    }
  },
  {
    id: 3,
    title: 'Module 3: Context Engineering',
    concept: 'Penyediaan Latar Belakang & Batasan Situasi',
    summary: 'AI tidak memiliki ingatan gaib tentang siapa Anda atau apa tujuan Anda. Konteks adalah jembatan informasi yang mencakup latar belakang masalah, audiens sasaran, dan data referensi yang relevan.',
    badExample: 'Buat soal latihan kimia.',
    betterExample: 'Saya adalah guru kimia SMA kelas 11. Siswa saya baru saja mempelajari Teori Asam-Basa Bronsted-Lowry dan sering kesulitan menentukan pasangan asam-basa konjugasi. Buat 3 soal pilihan ganda konseptual.',
    improvementReason: 'Konteks memberikan profil audiens (siswa SMA kelas 11), materi spesifik (Bronsted-Lowry), dan diagnosis kelemahan siswa (pasangan konjugasi).',
    keyTakeaway: 'Semakin kaya konteks situasional, semakin tepat sasaran solusi yang dirumuskan.',
    quiz: {
      question: 'Apa risiko terbesar jika sebuah prompt tidak menyertakan konteks sama sekali?',
      options: [
        'AI akan mengalami error server 500.',
        'Model membuat asumsi liar sendiri yang seringkali tidak relevan dengan kebutuhan nyata Anda.',
        'Model akan menghapus riwayat chat Anda.',
        'Waktu generasi teks menjadi 10 kali lebih lambat.'
      ],
      correctIndex: 1,
      explanation: 'Benar! Tanpa konteks, AI terpaksa menebak asumsi dasar audiens, tingkat kesulitan, atau tujuan dokumen.'
    }
  },
  {
    id: 4,
    title: 'Module 4: Instruction Precision',
    concept: 'Kata Kerja Operasional & Dekomposisi Tugas',
    summary: 'Instruksi utama harus menggunakan kata kerja tindakan yang eksplisit (Bloom\'s Taxonomy) dan memecah alur pemikiran menjadi langkah-langkah logika yang berurutan.',
    badExample: 'Tolong baca teks ini dan komentari.',
    betterExample: 'Tinjau draf abstrak skripsi terlampir. Evaluasi koherensi logis antara latar belakang masalah dan rumusan hipotesis. Berikan 3 kritik konstruktif dan rekomendasikan revisi 1 kalimat rumusan masalah.',
    improvementReason: '"Komentari" sangat ambigu. Contoh yang lebih baik mendefinisikan tugas secara operasional: evaluasi koherensi, berikan 3 kritik, dan buat rekomendasi revisi kalimat.',
    keyTakeaway: 'Gunakan kata kerja terukur: Analisis, Bedakan, Rangkum, Sintesis, atau Evaluasi.',
    quiz: {
      question: 'Di antara pilihan kata kerja berikut, manakah yang paling spesifik dan terarah dalam prompt instruksi?',
      options: [
        'Bantu saya dengan dokumen ini',
        'Pikirkan tentang topik ini',
        'Bandingkan kelebihan dan kekurangan metode A vs B dalam bentuk tabel 2 kolom',
        'Lakukan apa saja yang terbaik menurutmu'
      ],
      correctIndex: 2,
      explanation: 'Sempurna! Perintah membandingkan kelebihan/kekurangan dan meminta output tabel 2 kolom adalah instruksi operasional yang presisi.'
    }
  },
  {
    id: 5,
    title: 'Module 5: Constraint Prompting',
    concept: 'Pagar Pembatas (Guardrails) & Mitigasi Halusinasi',
    summary: 'Batasan (Constraints) memberi tahu AI apa yang TIDAK BOLEH dilakukan. Ini adalah pertahanan utama mencegah halusinasi data, gaya bahasa yang tidak pantas, atau teks yang terlalu panjang.',
    badExample: 'Jelaskan sejarah smartphone.',
    betterExample: 'Jelaskan evolusi ponsel pintar dari tahun 2007 hingga 2024. Batasan: (1) Maksimal 300 kata, (2) Jangan sebutkan rumor yang belum terkonfirmasi, (3) Hindari opini subjektif tentang merk mana yang terbaik, (4) Gunakan gaya bahasa formal.',
    improvementReason: 'Penambahan batas kata mencegah teks membengkak, dan aturan fakta menghindari klaim sepihak.',
    keyTakeaway: 'Definisikan batasan panjang, nada, bahasa, dan larangan spekulasi secara eksplisit.',
    quiz: {
      question: 'Batasan mana yang paling krusial ketika meminta AI menganalisis data keuangan sensitif?',
      options: [
        'Harus menggunakan huruf kapital semua.',
        'Hanya gunakan data angka yang terdapat dalam teks yang diberikan; jangan membuat estimasi tanpa dasar.',
        'Jadikan kalimatnya berima seperti puisi.',
        'Ketik dalam bahasa Prancis kuno.'
      ],
      correctIndex: 1,
      explanation: 'Tepat sekali! Membatasi AI hanya pada sumber data yang dilampirkan mencegah model mengarang angka fiktif.'
    }
  },
  {
    id: 6,
    title: 'Module 6: Output Formatting',
    concept: 'Strukturasi Hasil & Sintaks Parsing',
    summary: 'Meminta AI mengeluarkan jawaban dalam format terstruktur (Markdown Table, JSON, Numbered List, LaTeX) memudahkan pembacaan manusia dan integrasi otomatis ke sistem software.',
    badExample: 'Beri saya daftar negara ASEAN dan ibukotanya.',
    betterExample: 'Tampilkan 10 negara anggota ASEAN dalam tabel Markdown dengan kolom: [Nama Negara], [Ibu Kota], [Tahun Bergabung], dan [Mata Uang Resmi]. Urutkan berdasarkan tahun bergabung dari yang tertua.',
    improvementReason: 'Tabel Markdown dengan kolom terdefinisi dan aturan pengurutan langsung siap dipindahkan ke presentasi atau laporan.',
    keyTakeaway: 'Format yang konsisten menghemat 80% waktu merapikan dokumen secara manual.',
    quiz: {
      question: 'Format output apa yang paling ideal jika respon AI nantinya akan dibaca oleh kode program / script aplikasi?',
      options: [
        'Paragraf sastra berbunga-bunga',
        'Format JSON valid sesuai skema yang ditentukan',
        'Cerita bersambung',
        'Tanda tangan digital gambar'
      ],
      correctIndex: 1,
      explanation: 'Benar! Format JSON terstruktur adalah standar interoperabilitas data yang dapat di-parse langsung oleh aplikasi web/backend.'
    }
  },
  {
    id: 7,
    title: 'Module 7: Few-shot Prompting',
    concept: 'In-Context Learning Melalui Contoh Konkret',
    summary: 'Few-shot prompting adalah teknik menyertakan 1 atau beberapa pasangan contoh (Input -> Output) di dalam prompt. Ini mengajarkan pola penulisan dan standar kualitas tanpa perlu melatih ulang model.',
    badExample: 'Ubah ulasan pelanggan berikut menjadi label sentimen dan alasan.',
    betterExample: 'Klasifikasikan ulasan toko buku berikut menjadi Sentimen dan Alasan.\nContoh 1:\nInput: "Buku cepat sampai tapi sampulnya terlipat parah."\nOutput: [Sentimen: Campuran] | Alasan: Kecepatan pengiriman baik, namun kualitas pengemasan fisik rusak.\nSekarang kerjakan untuk input ini: "..."',
    improvementReason: 'Contoh konkret langsung mendiktekan format label, delimiter garis tegak, dan gaya bahasa alasan yang seragam.',
    keyTakeaway: 'Satu contoh nyata bernilai seribu kata instruksi teoritis.',
    quiz: {
      question: 'Apa perbedaan mendasar antara Zero-shot dan Few-shot prompting?',
      options: [
        'Zero-shot tidak memerlukan biaya listrik, Few-shot berbayar.',
        'Zero-shot langsung memberikan instruksi tanpa contoh; Few-shot menyertakan satu atau lebih contoh input-output sebelum mengeksekusi tugas.',
        'Few-shot hanya bisa digunakan untuk bahasa Inggris.',
        'Zero-shot menggunakan model yang lebih baru daripada Few-shot.'
      ],
      correctIndex: 1,
      explanation: 'Sangat tepat! Few-shot memanfaatkan kemampuan in-context learning model melalui demonstrasi contoh.'
    }
  },
  {
    id: 8,
    title: 'Module 8: Iterative Prompting',
    concept: 'Siklus Evaluasi, Diagnosa, & Refinement',
    summary: 'Prompt engineering adalah proses eksperimen berulang. Jangan kecewa jika hasil percobaan pertama belum sempurna; lakukan diagnosa mengapa AI gagal, lalu tambahkan batasan atau contoh baru.',
    badExample: 'Jawabannya jelek, ulangi yang lebih bagus!',
    betterExample: 'Tanggapan sebelumnya sudah baik pada bagian teori, namun contoh aplikasinya masih terlalu abstrak. Sekarang pertahankan definisi teori di atas, tetapi ganti contohnya dengan simulasi numerik neraca laba-rugi UMKM kuliner.',
    improvementReason: 'Memberikan umpan balik diagnostik yang konstruktif (pertahankan bagian A, perbaiki bagian B dengan kriteria C).',
    keyTakeaway: 'Anggap AI sebagai asisten magang: beri koreksi spesifik dan panduan terukur di setiap putaran.',
    quiz: {
      question: 'Jika hasil generasi AI masih terlalu panjang melebihi batas yang kamu inginkan, langkah perbaikan terbaik adalah:',
      options: [
        'Memarahi AI di kolom prompt.',
        'Menambahkan batasan eksplisit seperti: "Batasi jawaban tepat maksimal 3 paragraf (kurang dari 250 kata)".',
        'Menutup browser dan berganti laptop.',
        'Mengirim prompt yang sama persis 5 kali berturut-turut.'
      ],
      correctIndex: 1,
      explanation: 'Benar! Menambahkan batasan terukur adalah cara paling efektif mengendalikan panjang dan fokus luaran model.'
    }
  }
];
