"use client";

import { useEffect, useRef, useState } from "react";
import Hopper from "./Hopper";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const CHIPS = ["What do you charge?", "What have you built?", "Can you host my site?", "Which certs are you working on?"];

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/i;
const NAME_RE = /(?:my name is|i'?m|call me)\s+([A-Z][\w-]+(?:\s+[A-Z][\w-]+)?)/i;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [capture, setCapture] = useState<{ name?: string; email: string; message: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("hopper:pose", { detail: open ? "talking" : "reset" }));
  }, [open]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("chat:open", onOpen);
    return () => window.removeEventListener("chat:open", onOpen);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, capture, saved]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    setBusy(true);
    setSaved(false);

    // strip PII before it hits the model
    const emailMatch = content.match(EMAIL_RE);
    const nameMatch = content.match(NAME_RE);
    const safeContent = content.replace(EMAIL_RE, "[email removed]");

    const displayHistory: Msg[] = [...messages, { role: "user", content }];
    setMessages(displayHistory);

    if (emailMatch) {
      setCapture({
        name: nameMatch?.[1] ?? undefined,
        email: emailMatch[0],
        message: content.slice(0, 2000),
      });
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages.map((m) => ({ role: m.role, content: m.content })), { role: "user", content: safeContent }],
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: json.error || "Something went sideways." }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: json.reply }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Couldn't reach the homelab. Try the contact form instead." }]);
    } finally {
      setBusy(false);
    }
  };

  const saveLead = async () => {
    if (!capture) return;
    const res = await fetch("/api/chat/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(capture),
    });
    if (res.ok) {
      setSaved(true);
      setCapture(null);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Thanks — I saved your info. JJ will get back to you (and I'll drop the notification in real time)." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[30rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border-2 border-ink bg-paper shadow-2xl">
          <div className="flex items-center gap-3 bg-ink px-4 py-3">
            <div className="h-11 w-8">
              <Hopper pose={busy ? "talking" : "idle"} className="h-11 w-8" />
            </div>
            <div>
              <p className="font-display text-base font-extrabold text-paper">Hopper</p>
              <p className="font-body text-xs text-paper/70">{busy ? "thinking…" : "ask me anything about JJ"}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-paper/10 font-body text-paper hover:bg-paper/20">
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="chat-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <>
                <p className="font-body text-sm text-ink/80">
                  Hey, I&apos;m Hopper 👋 — I run the bullpen for JJ. Ask about projects, pricing, hosting, or certs.
                </p>
                <div className="flex flex-wrap gap-2">
                  {CHIPS.map((c) => (
                    <button
                      key={c}
                      onClick={() => send(c)}
                      className="rounded-full border-2 border-ink px-3 py-1.5 font-body text-xs font-bold text-ink transition-colors hover:bg-electric"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 font-body text-sm ${
                    m.role === "user"
                      ? "rounded-br-sm bg-court text-ink"
                      : "rounded-bl-sm border-2 border-ink/15 bg-paper-deep text-ink"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {capture && !saved && (
              <div className="rounded-2xl border-2 border-grape bg-grape/10 px-3.5 py-2.5">
                <p className="font-body text-xs text-ink/80">
                  Want me to save <strong>{capture.email}</strong> as a lead so JJ can follow up?
                </p>
                <button onClick={saveLead} className="mt-2 rounded-full bg-grape px-4 py-1.5 font-body text-xs font-bold text-paper">
                  Yes, save it
                </button>
              </div>
            )}

            {busy && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border-2 border-ink/15 bg-paper-deep px-3.5 py-2.5 font-body text-sm text-ink/60">
                  …
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
              setInput("");
            }}
            className="flex gap-2 border-t-2 border-ink/10 bg-paper px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question…"
              className="flex-1 rounded-full border-2 border-ink/25 bg-paper px-4 py-2.5 font-body text-sm text-ink outline-none focus:border-electric"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="grid h-10 w-10 place-items-center rounded-full bg-ink font-body text-paper transition-transform hover:scale-105 disabled:opacity-40"
            >
              ↑
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle chat with Hopper"
        aria-expanded={open}
        className="grid h-16 w-16 place-items-center rounded-full border-2 border-ink shadow-chunky transition-transform hover:scale-105"
        style={{ background: "var(--electric-cyan)" }}
      >
        <Hopper pose={open ? "talking" : "idle"} className="h-12 w-9" />
      </button>
    </div>
  );
}