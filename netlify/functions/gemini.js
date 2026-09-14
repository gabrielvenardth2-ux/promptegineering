// netlify/functions/gemini.js
// Netlify Serverless Function for Gemini API proxy

const { GoogleGenAI } = require("@google/genai");

exports.handler = async function (event) {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "OK" }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: false,
        error: "AI Assistant is not configured yet. GEMINI_API_KEY belum dikonfigurasi di Netlify Environment Variables.",
        localMode: true,
      }),
    };
  }

  let bodyData;
  try {
    bodyData = JSON.parse(event.body || "{}");
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: "Invalid JSON body" }),
    };
  }

  const { action, promptData, query } = bodyData;

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let systemInstruction =
      "Kamu adalah AI Prompt Engineering Assistant ahli. Tugasmu membantu pengguna (siswa, pengajar, peneliti) merancang dan menyempurnakan prompt terstruktur sesuai standar Prompt Engineering (Role, Context, Instruction, Constraints, Output Format, Examples). Selalu berikan output dalam bahasa Indonesia yang profesional, ramah, dan aplikatif.";

    let promptContents = "";

    switch (action) {
      case "improve":
        promptContents = `Analisis dan sempurnakan struktur prompt berikut:
ROLE: ${promptData?.role || "(belum diisi)"}
CONTEXT: ${promptData?.context || "(belum diisi)"}
INSTRUCTION: ${promptData?.instruction || "(belum diisi)"}
CONSTRAINTS: ${Array.isArray(promptData?.constraints) ? promptData.constraints.join("; ") : "(belum diisi)"}
OUTPUT FORMAT: ${promptData?.outputFormat || "(belum diisi)"}
EXAMPLE: ${promptData?.example ? `Input: ${promptData.example.input} | Output: ${promptData.example.output}` : "(tidak ada)"}

Kembalikan respon JSON persis dengan format:
{
  "improvedRole": "...",
  "improvedContext": "...",
  "improvedInstruction": "...",
  "suggestedConstraints": ["...", "..."],
  "suggestedOutputFormat": "...",
  "explanation": "Penjelasan mengapa perubahan ini membuat prompt jauh lebih efektif..."
}`;
        break;

      case "generate_role":
        promptContents = `Berdasarkan instruksi atau topik berikut:
"${promptData?.instruction || query || "Bantuan akademik umum"}"
dan konteks: "${promptData?.context || ""}"

Buatlah definisi ROLE (Peran persona AI) yang ideal, memiliki otoritas keilmuan, nada bicara yang tepat, dan kredibilitas.
Kembalikan JSON dengan format:
{
  "role": "Kamu adalah seorang...",
  "explanation": "Alasan pemilihan peran ini..."
}`;
        break;

      case "generate_context":
        promptContents = `Berdasarkan peran: "${promptData?.role || ""}" dan instruksi: "${promptData?.instruction || query || ""}",
Buatkan CONTEXT (latar belakang situasi, sasaran audiens, dan data dasar yang dibutuhkan) agar AI memahami situasi dengan presisi.
Kembalikan JSON dengan format:
{
  "context": "...",
  "explanation": "..."
}`;
        break;

      case "suggest_constraints":
        promptContents = `Untuk prompt dengan instruksi: "${promptData?.instruction || query || ""}" dan peran: "${promptData?.role || ""}",
Berikan 4 hingga 6 batasan (CONSTRAINTS) penting agar AI tidak berhalusinasi, menjaga objektivitas, membatasi panjang, dan menggunakan bahasa yang sesuai.
Kembalikan JSON dengan format:
{
  "constraints": ["Batasan 1", "Batasan 2", "Batasan 3", "Batasan 4"],
  "explanation": "Mengapa batasan-batasan ini krusial..."
}`;
        break;

      case "suggest_format":
        promptContents = `Untuk prompt dengan instruksi: "${promptData?.instruction || query || ""}",
Rekomendasikan format output terbaik (misalnya Bullet points, Markdown Table, Step-by-step guide, JSON, dsb) beserta template susunannya.
Kembalikan JSON dengan format:
{
  "formatType": "...",
  "formatStructure": "...",
  "explanation": "..."
}`;
        break;

      case "generate_fewshot":
        promptContents = `Buat 1 contoh pasangan Few-shot (Example Input & Example Output) yang relevan untuk instruksi:
"${promptData?.instruction || query || "Menganalisis paragraf"}"
dan format: "${promptData?.outputFormat || "Bullet points"}".
Kembalikan JSON dengan format:
{
  "exampleInput": "...",
  "exampleOutput": "...",
  "explanation": "..."
}`;
        break;

      case "explain":
        promptContents = `Jelaskan secara didaktis dan mendalam mengapa susunan prompt ini efektif dari perspektif Prompt Engineering:
ROLE: ${promptData?.role || "-"}
CONTEXT: ${promptData?.context || "-"}
INSTRUCTION: ${promptData?.instruction || "-"}
CONSTRAINTS: ${Array.isArray(promptData?.constraints) ? promptData.constraints.join("; ") : "-"}
OUTPUT FORMAT: ${promptData?.outputFormat || "-"}

Jelaskan pilar-pilar yang membuatnya kokoh, potensi kelemahannya, dan tips eksekusinya.
Kembalikan JSON dengan format:
{
  "strengths": ["...", "..."],
  "potentialRisks": ["...", "..."],
  "pedagogicalInsight": "..."
}`;
        break;

      case "challenge_review":
        promptContents = `Pengguna sedang mengerjakan tantangan prompt engineering:
Skenario: "${query || "Tantangan membuat prompt"}"
Prompt buatan pengguna:
ROLE: ${promptData?.role || "-"}
CONTEXT: ${promptData?.context || "-"}
INSTRUCTION: ${promptData?.instruction || "-"}
CONSTRAINTS: ${Array.isArray(promptData?.constraints) ? promptData.constraints.join("; ") : "-"}
OUTPUT FORMAT: ${promptData?.outputFormat || "-"}

Nilai prompt pengguna dengan objektif dan berikan ulasan konstruktif.
Kembalikan JSON dengan format:
{
  "score": 85,
  "verdict": "...",
  "feedback": "...",
  "keyStrengths": ["..."],
  "areasForImprovement": ["..."]
}`;
        break;

      default:
        promptContents = `Berikan saran singkat perbaikan untuk prompt berikut:
${JSON.stringify(promptData || {})}
Kembalikan JSON: { "result": "...", "suggestions": ["..."], "explanation": "..." }`;
        break;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptContents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text ? response.text.trim() : "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = { result: responseText };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        data: parsedData,
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: false,
        error: error.message || "Gagal menghubungi Gemini API.",
        localMode: true,
      }),
    };
  }
};
