import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(
        process.env.GEMINI_API_KEY &&
          process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" &&
          process.env.GEMINI_API_KEY.trim() !== ""
      ),
    });
  });

  // Handler for Gemini AI requests (supports both Netlify Functions path & /api/gemini)
  const handleGeminiRequest: express.RequestHandler = async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") {
      res.json({
        ok: false,
        error:
          "AI Assistant is not configured yet. Local Builder is still available.",
        localMode: true,
      });
      return;
    }

    const { action, promptData, query } = req.body || {};

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction =
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
          promptContents = `Berikan saran perbaikan untuk prompt berikut:
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

      res.json({
        ok: true,
        data: parsedData,
      });
    } catch (error: any) {
      res.json({
        ok: false,
        error: error?.message || "Gagal menghubungi Gemini API.",
        localMode: true,
      });
    }
  };

  app.post("/.netlify/functions/gemini", handleGeminiRequest);
  app.post("/api/gemini", handleGeminiRequest);

  // Vite middleware in dev mode / static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Prompt Engineering Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
