import { getSettingsOrThrow, getPortfolioItems, getPricingTiers } from "./data";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function callAI(messages: ChatMessage[]): Promise<string> {
  const s = await getSettingsOrThrow();
  const [items, tiers] = await Promise.all([getPortfolioItems(), getPricingTiers()]);

  const portfolioList = items
    .map((i) => `- ${i.title} (${i.category}): ${i.description} Tech: ${i.techTags}${i.liveUrl ? ` Live: ${i.liveUrl}` : ""}`)
    .join("\n");

  const pricingList = tiers
    .map((t) => `- ${t.name}: $${t.rangeLow}–$${t.rangeHigh}. ${t.description}`)
    .join("\n");

  const system = [
    s.aiSystemPrompt,
    "",
    `About JJ:\n${s.aboutContent}\n`,
    `Journey:\n${s.journeyContent}\n`,
    `Known projects:\n${portfolioList}\n`,
    `Pricing tiers:\n${pricingList}`,
  ].join("\n");

  const fullMessages = [{ role: "system", content: system }, ...messages];

  const provider = s.aiProvider || "ollama";
  let reply = "";

  if (provider === "ollama") {
    const base = (s.aiEndpoint || "http://192.168.1.154:11434").replace(/\/v1\/?$/, "").replace(/\/$/, "");
    const res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: s.aiModel,
        messages: fullMessages,
        stream: false,
        options: { temperature: s.aiTemperature },
      }),
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) throw new Error(`Ollama ${res.status}: ${await res.text()}`);
    const json = await res.json();
    reply = json.message?.content ?? "No response from model.";
  } else {
    // openrouter / openai-compatible
    const endpoint = s.aiEndpoint || "https://openrouter.ai/api/v1";
    const res = await fetch(`${endpoint.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(s.aiApiKey ? { Authorization: `Bearer ${s.aiApiKey}` } : {}),
      },
      body: JSON.stringify({
        model: s.aiModel,
        messages: fullMessages,
        temperature: s.aiTemperature,
      }),
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) throw new Error(`AI provider ${res.status}: ${await res.text()}`);
    const json = await res.json();
    reply = json.choices?.[0]?.message?.content ?? "No response from model.";
  }

  return reply.trim();
}