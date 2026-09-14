import { PromptScore, PromptState } from '../types';

export function calculateLocalPromptScore(state: PromptState): PromptScore {
  let clarity = 0;
  let context = 0;
  let specificity = 0;
  let constraints = 0;
  let outputStructure = 0;
  const feedback: string[] = [];

  // --- 1. CLARITY (0-20) ---
  const inst = state.instruction.trim();
  if (inst.length === 0) {
    feedback.push('Instruksi utama masih kosong. Tuliskan tugas inti yang harus diselesaikan AI.');
  } else if (inst.length < 20) {
    clarity += 8;
    feedback.push('Instruksi terlalu singkat. Gunakan kata kerja operasional yang spesifik.');
  } else {
    clarity += 14;
    // Check for operational verbs
    const actionVerbs = /(analisis|jelaskan|rangkum|bandingkan|hitung|buat|evaluasi|susun|identifikasi|tulis|rumuskan|telaah)/i;
    if (actionVerbs.test(inst)) {
      clarity += 6;
    } else {
      clarity += 3;
      feedback.push('Tambahkan kata kerja tindakan yang tegas (misal: "Analisis...", "Bandingkan...", "Susunlah...")');
    }
  }

  // --- 2. CONTEXT (0-20) ---
  const role = state.role.trim();
  const ctx = state.context.trim();

  if (role.length > 0) {
    if (role.length > 25 || /(kamu adalah|seorang|pakar|ahli|tutor|guru|profesor|dosen|peneliti|spesialis)/i.test(role)) {
      context += 10;
    } else {
      context += 6;
      feedback.push('Pertajam Role dengan otoritas keilmuan dan nada komunikasi yang spesifik.');
    }
  } else {
    feedback.push('Role belum diisi. Menentukan persona AI menghasilkan gaya respons yang jauh lebih konsisten.');
  }

  if (ctx.length > 0) {
    if (ctx.length >= 60) {
      context += 10;
    } else if (ctx.length >= 20) {
      context += 6;
      feedback.push('Konteks sudah ada, namun akan lebih kuat jika situasi atau audiens sasaran diperjelas.');
    } else {
      context += 3;
      feedback.push('Konteks terlalu minim. Berikan latar belakang situasi pengguna.');
    }
  } else {
    feedback.push('Konteks belum diisi. AI membutuhkan latar situasi agar jawaban tidak keluar konteks.');
  }

  // --- 3. SPECIFICITY (0-20) ---
  let specScore = 0;
  const totalLength = (role.length + ctx.length + inst.length);
  if (totalLength > 200) specScore += 8;
  else if (totalLength > 80) specScore += 5;
  else if (totalLength > 30) specScore += 2;

  // Check for target audience / parameters / numbers
  if (/\b(siswa|mahasiswa|pemula|profesional|publik|umum|sma|smp|kuliah|akademik)\b/i.test(ctx + inst + role)) {
    specScore += 5;
  }
  // Check for length or scope words
  if (/\b(kata|paragraf|bab|tahap|langkah|poin|metode|data|sumber)\b/i.test(ctx + inst)) {
    specScore += 4;
  }
  // Few shot bonus for specificity
  if (state.enableFewShot && state.fewShot.input.trim().length > 0 && state.fewShot.output.trim().length > 0) {
    specScore += 3;
  }
  specificity = Math.min(20, specScore);

  // --- 4. CONSTRAINTS (0-20) ---
  const validConstraints = state.constraints.filter((c) => c.trim().length > 0);
  if (validConstraints.length === 0) {
    feedback.push('Belum ada Batasan (Constraints). Batasan penting untuk mencegah halusinasi dan membatasi panjang jawaban.');
  } else if (validConstraints.length === 1) {
    constraints = 9;
    feedback.push('Terdapat 1 batasan. Tambahkan batasan lain seperti gaya bahasa, batas kata, atau kredibilitas sumber.');
  } else if (validConstraints.length === 2) {
    constraints = 15;
  } else {
    constraints = 20;
  }

  // --- 5. OUTPUT STRUCTURE (0-20) ---
  if (state.outputFormat === 'Custom') {
    if (state.customOutputFormat.trim().length > 10) {
      outputStructure = 20;
    } else {
      outputStructure = 10;
      feedback.push('Format kustom masih singkat. Definisikan format dokumen/skema yang diinginkan.');
    }
  } else if (state.outputFormat) {
    if (['Table', 'JSON', 'Step-by-step'].includes(state.outputFormat)) {
      outputStructure = 20;
    } else {
      outputStructure = 16;
    }
  }

  // Bonus consideration for Few-Shot example
  if (state.enableFewShot) {
    if (state.fewShot.input.trim() && state.fewShot.output.trim()) {
      feedback.push('Few-shot example aktif dan terisi! Ini teknik priming efektif untuk mengarahkan model.');
    } else {
      feedback.push('Few-shot diaktifkan tetapi input/output contoh masih kosong.');
    }
  }

  const total = Math.min(100, clarity + context + specificity + constraints + outputStructure);

  let grade: PromptScore['grade'] = 'Needs Work';
  if (total >= 90) grade = 'Mastery';
  else if (total >= 78) grade = 'Excellent';
  else if (total >= 60) grade = 'Good';
  else if (total >= 40) grade = 'Fair';

  // If no feedback needed, give encouragement
  if (feedback.length === 0 || (feedback.length === 1 && total >= 85)) {
    feedback.unshift('Struktur prompt sangat terarah, seimbang, dan siap dieksekusi dengan akurasi tinggi.');
  }

  return {
    total,
    breakdown: {
      clarity,
      context,
      specificity,
      constraints,
      outputStructure,
    },
    feedback,
    grade,
  };
}
