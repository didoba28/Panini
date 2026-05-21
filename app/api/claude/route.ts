// Proxy OpenAI GPT-4o — clé cachée côté serveur
// Accepte { messages, maxTokens } — messages au format OpenAI (role/content)
export async function POST(req: Request) {
  const { messages, maxTokens = 1000 } = await req.json();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: maxTokens,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  // Renvoie le texte directement pour simplifier le consommateur
  return Response.json({
    text: data.choices?.[0]?.message?.content ?? "",
    raw: data,
  });
}
