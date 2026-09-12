export interface LeadInput {
  name: string;
  email: string;
  projectType?: string | null;
  message: string;
  source: "contact_form" | "chatbot";
}

function sanitize(s: string): string {
  return s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim();
}

export async function sendNtfy(lead: LeadInput): Promise<void> {
  const url = (process.env.NTFY_TOPIC_URL || "").trim();
  if (!url) return;

  const type = lead.projectType || "general";
  const body = {
    title: `New ${lead.source === "chatbot" ? "chat" : "contact"} lead — jjs.jewellcore.com`,
    message: `${sanitize(lead.name)} <${sanitize(lead.email)}>\nType: ${sanitize(type)}\n\n${sanitize(lead.message)}`,
    tags: ["inbox_tray"],
    priority: 4,
    actions: [
      {
        action: "view",
        label: "Open lead inbox",
        url: "https://jjs.jewellcore.com/command-center",
      },
    ],
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (process.env.NTFY_ACCESS_TOKEN) {
      headers.Authorization = `Bearer ${process.env.NTFY_ACCESS_TOKEN}`;
    }
    await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    // Notification must never break the response path.
    console.error("[ntfy] notification failed", e);
  }
}