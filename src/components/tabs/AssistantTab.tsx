"use client";

import { useEffect, useRef, useState } from "react";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { PixelSprite } from "@/components/pixel/PixelSprite";
import { GUIDE } from "@/components/pixel/sprites";
import { InfoIcon, ResetIcon, SendIcon, SparkleIcon } from "@/components/icons";
import type { AnswerMode, AssistantResponse, CitationDto } from "@/lib/api/types";

type Message = {
  id: string;
  role: "user" | "assistant" | "error";
  text: string;
  citations?: CitationDto[];
  mode?: AnswerMode;
  supported?: boolean;
  retryQuestion?: string;
};

let counter = 0;
function nextId(): string {
  counter += 1;
  return `msg-${Date.now()}-${counter}`;
}

export function AssistantTab() {
  const { t, lang } = useExperience();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, loading]);

  const ask = async (raw: string, addUser = true) => {
    const question = raw.trim();
    if (!question || loading) return;

    if (addUser) {
      setMessages((previous) => [
        ...previous,
        { id: nextId(), role: "user", text: question },
      ]);
    }
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, lang }),
      });
      if (!response.ok) throw new Error("Request failed");
      const data = (await response.json()) as AssistantResponse;
      setMessages((previous) => [
        ...previous,
        {
          id: nextId(),
          role: "assistant",
          text: data.answer,
          citations: data.citations,
          mode: data.mode,
          supported: data.supported,
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          id: nextId(),
          role: "error",
          text: "",
          retryQuestion: question,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    if (loading) return;
    setMessages([]);
    setInput("");
  };

  const statusLabel: Record<CitationDto["status"], string> = {
    official: t.assistant.statusOfficial,
    historical: t.assistant.statusHistorical,
    educational: t.assistant.statusEducational,
  };

  return (
    <>
      <div className="page-head">
        <span className="kicker">{t.assistant.kicker}</span>
        <h1>{t.assistant.title}</h1>
        <p className="lede">{t.assistant.subtitle}</p>
      </div>

      <div className="chat">
        <section className="card chat-panel" aria-label={t.assistant.title}>
          <div className="chat-head">
            <span className="chat-avatar" aria-hidden="true">
              <PixelSprite rows={GUIDE} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{t.assistant.assistant}</strong>
              <small>{t.assistant.modeCurated}</small>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={clear}
              disabled={loading || messages.length === 0}
            >
              <ResetIcon />
              <span className="hide-sm">{t.assistant.clear}</span>
            </button>
          </div>

          <div className="chat-scroll" ref={scrollRef} aria-live="polite">
            <div className="msg msg-assistant">
              <div className="msg-bubble">{t.assistant.welcome}</div>
            </div>

            {messages.map((message) => {
              if (message.role === "user") {
                return (
                  <div key={message.id} className="msg msg-user">
                    <div className="msg-bubble">{message.text}</div>
                    <span className="msg-meta">{t.assistant.you}</span>
                  </div>
                );
              }

              if (message.role === "error") {
                return (
                  <div key={message.id} className="msg msg-assistant">
                    <div className="msg-bubble">
                      <strong>{t.assistant.errorTitle}</strong>
                      <p>{t.assistant.errorBody}</p>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm mt-2"
                        onClick={() =>
                          message.retryQuestion && ask(message.retryQuestion, false)
                        }
                      >
                        {t.assistant.retry}
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={message.id} className="msg msg-assistant">
                  {message.supported === false ? (
                    <span className="badge badge-coral">
                      {t.assistant.unsupportedTitle}
                    </span>
                  ) : null}
                  <div className="msg-bubble">{message.text}</div>
                  {message.citations && message.citations.length > 0 ? (
                    <div className="citations">
                      <span className="msg-meta">{t.assistant.citations} :</span>
                      {message.citations.map((citation) => (
                        <span
                          key={`${message.id}-${citation.page}`}
                          className="citation"
                          title={citation.title}
                        >
                          {citation.page} · {statusLabel[citation.status]}
                        </span>
                      ))}
                    </div>
                  ) : message.supported === true ? (
                    <span className="msg-meta">{t.assistant.noCitations}</span>
                  ) : null}
                  {message.mode ? (
                    <span className="msg-meta">
                      {message.mode === "ai"
                        ? t.assistant.modeAi
                        : t.assistant.modeCurated}
                    </span>
                  ) : null}
                </div>
              );
            })}

            {loading ? (
              <div className="msg msg-assistant">
                <div className="msg-bubble">
                  <span className="typing" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="sr-only">{t.assistant.thinking}</span>
                  <span className="small muted"> {t.assistant.thinking}</span>
                </div>
              </div>
            ) : null}
          </div>

          <form
            className="chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              void ask(input);
            }}
          >
            <label htmlFor="assistant-input" className="sr-only">
              {t.assistant.placeholder}
            </label>
            <textarea
              id="assistant-input"
              className="chat-input"
              rows={1}
              value={input}
              placeholder={t.assistant.placeholder}
              maxLength={600}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void ask(input);
                }
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || input.trim().length < 2}
              aria-label={t.assistant.send}
            >
              <SendIcon />
              <span className="hide-sm">{t.common.send}</span>
            </button>
          </form>
        </section>

        <aside className="stack">
          <div className="card card-tight stack">
            <strong className="small">{t.assistant.suggestedTitle}</strong>
            <div className="suggestions">
              {t.assistant.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="suggestion"
                  onClick={() => void ask(suggestion)}
                  disabled={loading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="callout">
            <span className="callout-icon" aria-hidden="true">
              <InfoIcon />
            </span>
            <div>
              <strong>{t.common.simulation}</strong>
              <p>{t.assistant.disclaimer}</p>
            </div>
          </div>

          <div className="callout callout-coral">
            <span className="callout-icon" aria-hidden="true">
              <SparkleIcon />
            </span>
            <div>
              <strong>{t.assistant.modeCurated}</strong>
              <p className="tiny">{t.footer.independence}</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
