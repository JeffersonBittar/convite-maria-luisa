export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key não configurada na Vercel" });
  }

  try {
    // 🔥 CORREÇÃO AQUI — faça parse do JSON corretamente
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return res.status(500).json({ error: "Erro ao acessar a API do Gemini" });
  }
}
