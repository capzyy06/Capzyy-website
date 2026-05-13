import { useState, useEffect, useRef } from "react";
import { supportApi, connectSocket, disconnectSocket } from "../../store/api/supportApi";

// ── Design tokens ────────────────────────────────────────────────────────────
const LIME    = "#C8F135";
const DARK    = "#0a0a0a";
const SURFACE = "#141414";
const SURFACE2 = "#1C1C1C";
const BORDER  = "#2A2A2A";
const TEXT    = "#F5F0E8";
const MUTED   = "#888888";

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const PRESET_QUESTIONS = [
  { label: "📦 Delivery issue", text: "I have a problem with my delivery." },
  { label: "↩️ Return request", text: "I'd like to request a return." },
  { label: "📏 Size help",      text: "I need help choosing the right size." },
  { label: "💳 Payment issue",  text: "I have a payment-related question." },
];

const FAQ_ITEMS = [
  { q: "How long does delivery take?",  a: "We deliver within 6–7 working days across India." },
  { q: "What is your return policy?",   a: "We currently do not accept returns. Please reach out before ordering if you have size concerns." },
  { q: "How do I track my order?",      a: "Check your email for a tracking link, or visit the Orders section in your account." },
];

// ── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isAdmin = msg.senderRole === "admin";
  return (
    <div style={{
      display: "flex",
      justifyContent: isAdmin ? "flex-start" : "flex-end",
      marginBottom: "12px",
      gap: "8px",
      alignItems: "flex-end",
    }}>
      {isAdmin && (
        <div style={{
          width: "26px", height: "26px", borderRadius: "50%",
          background: LIME, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "12px", flexShrink: 0,
        }}>🧢</div>
      )}
      <div style={{
        maxWidth: "72%",
        padding: "10px 14px",
        borderRadius: isAdmin ? "2px 14px 14px 14px" : "14px 2px 14px 14px",
        background: isAdmin ? SURFACE2 : LIME,
        color: isAdmin ? TEXT : DARK,
        fontSize: "13px", lineHeight: "1.55",
        border: `1px solid ${isAdmin ? BORDER : "transparent"}`,
        boxShadow: isAdmin ? "none" : `0 2px 12px rgba(200,241,53,0.15)`,
      }}>
        {isAdmin && (
          <div style={{ fontSize: "9px", color: LIME, marginBottom: "4px", fontWeight: 800, letterSpacing: "0.12em" }}>
            CAPZYY SUPPORT
          </div>
        )}
        <div style={{ fontWeight: isAdmin ? 400 : 500 }}>{msg.text}</div>
        <div style={{ fontSize: "10px", opacity: 0.45, marginTop: "5px", textAlign: "right", color: isAdmin ? MUTED : DARK }}>
          {formatTime(msg.createdAt)}
        </div>
      </div>
    </div>
  );
}

// ── FAQ Section ───────────────────────────────────────────────────────────────
function FAQSection({ onPreset }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div style={{ padding: "16px" }}>

      {/* Section label */}
      <div style={{ fontSize: "9px", fontWeight: 800, color: MUTED, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "10px" }}>
        Common Questions
      </div>

      {/* FAQ accordion */}
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} style={{
          borderRadius: "6px", background: SURFACE2,
          marginBottom: "6px", overflow: "hidden",
          border: `1px solid ${openIdx === i ? BORDER : "transparent"}`,
          transition: "border-color 0.15s",
        }}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            style={{
              width: "100%", textAlign: "left", padding: "11px 14px",
              background: "none", border: "none", cursor: "pointer",
              fontSize: "12.5px", fontWeight: 600, color: TEXT,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              gap: "12px", fontFamily: "inherit",
            }}
          >
            <span>{item.q}</span>
            <span style={{
              color: LIME, fontSize: "18px", lineHeight: 1,
              transform: openIdx === i ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              flexShrink: 0,
            }}>+</span>
          </button>
          {openIdx === i && (
            <div style={{
              padding: "0 14px 12px",
              fontSize: "12px", color: MUTED, lineHeight: 1.6,
              borderTop: `1px solid ${BORDER}`,
              paddingTop: "10px",
            }}>
              {item.a}
            </div>
          )}
        </div>
      ))}

      {/* Divider */}
      <div style={{ height: "1px", background: BORDER, margin: "16px 0" }} />

      {/* Section label */}
      <div style={{ fontSize: "9px", fontWeight: 800, color: MUTED, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "10px" }}>
        Quick Actions
      </div>

      {/* Preset chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {PRESET_QUESTIONS.map((pq) => (
          <button
            key={pq.label}
            onClick={() => onPreset(pq.text)}
            style={{
              padding: "7px 12px", borderRadius: "4px",
              border: `1px solid ${BORDER}`,
              background: "transparent", color: TEXT,
              fontSize: "11.5px", fontWeight: 600, cursor: "pointer",
              transition: "all 0.15s", fontFamily: "inherit",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = LIME;
              e.currentTarget.style.color = LIME;
              e.currentTarget.style.background = "rgba(200,241,53,0.04)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = BORDER;
              e.currentTarget.style.color = TEXT;
              e.currentTarget.style.background = "transparent";
            }}
          >
            {pq.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Login Prompt ──────────────────────────────────────────────────────────────
function LoginPrompt() {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 28px", textAlign: "center",
    }}>
      <div style={{
        width: "52px", height: "52px", borderRadius: "50%",
        background: SURFACE2, border: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "22px", marginBottom: "16px",
      }}>🔒</div>
      <div style={{ fontWeight: 800, fontSize: "14px", color: TEXT, marginBottom: "8px", letterSpacing: "0.04em" }}>
        Sign in to chat
      </div>
      <div style={{ fontSize: "12px", color: MUTED, lineHeight: 1.6, marginBottom: "24px", maxWidth: "200px" }}>
        Get real-time support from our team.
      </div>
      <a
        href="/login"
        style={{
          background: LIME, color: DARK, fontWeight: 800,
          padding: "10px 28px", borderRadius: "4px",
          textDecoration: "none", fontSize: "11px",
          letterSpacing: "0.12em", textTransform: "uppercase",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Sign In
      </a>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SupportChatBox({ user, onClose }) {
  const [view, setView] = useState("faq");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [convoLoading, setConvoLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    setConvoLoading(true);
    (async () => {
      try {
        const convo = await supportApi.getOrCreateConversation();
        setConversationId(convo._id);
        const msgs = await supportApi.getMessages(convo._id);
        setMessages(msgs);
        if (msgs.length > 0) setView("chat");
      } catch {
        setError("Could not load conversation.");
      } finally {
        setConvoLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!conversationId || !user) return;
    const socket = connectSocket();
    socket.emit("join_conversation", conversationId);
    socket.on("new_message", (msg) => setMessages((prev) => [...prev, msg]));
    return () => { socket.off("new_message"); disconnectSocket(); };
  }, [conversationId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text?.trim() || loading) return;
    setError("");
    setLoading(true);
    try {
      let convoId = conversationId;
      if (!convoId) {
        const convo = await supportApi.getOrCreateConversation();
        convoId = convo._id;
        setConversationId(convoId);
      }
      const newMsg = await supportApi.sendMessage(convoId, text);
      setMessages((prev) => [...prev, newMsg]);
      setInput("");
      setView("chat");
    } catch (e) {
      setError(e.response?.data?.message || "Failed to send.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (text) => {
    setView("chat");
    sendMessage(text);
  };

  return (
    <div style={{
      position: "fixed", bottom: "88px", right: "20px",
      width: "350px", height: "530px",
      borderRadius: "10px",
      background: SURFACE,
      boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
      display: "flex", flexDirection: "column",
      overflow: "hidden", zIndex: 999,
      fontFamily: "'Barlow Condensed', sans-serif",
      border: `1px solid ${BORDER}`,
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: "14px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${BORDER}`,
        background: SURFACE,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: LIME, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "14px", flexShrink: 0,
          }}>🧢</div>
          <div>
            <div style={{ color: TEXT, fontWeight: 800, fontSize: "13px", letterSpacing: "0.08em" }}>
              CAPZYY SUPPORT
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: LIME }} />
              <span style={{ color: MUTED, fontSize: "10px", letterSpacing: "0.04em" }}>Usually replies in minutes</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: SURFACE2, border: `1px solid ${BORDER}`,
            color: MUTED, cursor: "pointer",
            width: "28px", height: "28px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", lineHeight: 1, transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = TEXT; e.currentTarget.style.borderColor = MUTED; }}
          onMouseLeave={e => { e.currentTarget.style.color = MUTED; e.currentTarget.style.borderColor = BORDER; }}
        >×</button>
      </div>

      {/* ── Tabs (only when logged in) ── */}
      {user && (
        <div style={{
          display: "flex",
          borderBottom: `1px solid ${BORDER}`,
          background: SURFACE,
          flexShrink: 0,
        }}>
          {[
            { key: "faq",  label: "FAQ" },
            { key: "chat", label: "Chat" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              style={{
                flex: 1, padding: "11px 0",
                fontSize: "10px", fontWeight: 800,
                letterSpacing: "0.14em", textTransform: "uppercase",
                border: "none", background: "none", cursor: "pointer",
                color: view === key ? LIME : MUTED,
                borderBottom: view === key ? `2px solid ${LIME}` : "2px solid transparent",
                transition: "color 0.15s, border-color 0.15s",
                fontFamily: "inherit",
              }}
            >{label}</button>
          ))}
        </div>
      )}

      {/* ── Body ── */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", background: DARK }}>
        {!user ? (
          <LoginPrompt />
        ) : view === "faq" ? (
          <FAQSection onPreset={handlePreset} />
        ) : (
          <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
            {convoLoading ? (
              <div style={{ textAlign: "center", color: MUTED, fontSize: "12px", marginTop: "48px" }}>
                Loading messages…
              </div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: "48px" }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>👋</div>
                <div style={{ color: MUTED, fontSize: "12px" }}>No messages yet. Say hello!</div>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble key={msg._id} msg={msg} currentUserId={user?._id} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          padding: "8px 16px",
          background: "rgba(255,107,107,0.06)",
          color: "#ff6b6b", fontSize: "11px",
          borderTop: `1px solid rgba(255,107,107,0.15)`,
          letterSpacing: "0.02em",
          flexShrink: 0,
        }}>
          {error}
        </div>
      )}

      {/* ── Input ── */}
      {user && (
        <div style={{
          padding: "12px 14px",
          borderTop: `1px solid ${BORDER}`,
          display: "flex", gap: "8px",
          background: SURFACE,
          alignItems: "center",
          flexShrink: 0,
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder={convoLoading ? "Loading…" : "Type a message…"}
            disabled={loading || convoLoading}
            style={{
              flex: 1, padding: "9px 13px",
              borderRadius: "6px",
              border: `1px solid ${BORDER}`,
              background: SURFACE2,
              color: TEXT, fontSize: "13px",
              outline: "none", fontFamily: "inherit",
              letterSpacing: "0.02em",
              transition: "border-color 0.15s",
              opacity: convoLoading ? 0.5 : 1,
            }}
            onFocus={e => e.target.style.borderColor = LIME}
            onBlur={e => e.target.style.borderColor = BORDER}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              width: "36px", height: "36px", borderRadius: "6px",
              background: loading || !input.trim() ? SURFACE2 : LIME,
              border: `1px solid ${loading || !input.trim() ? BORDER : LIME}`,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.15s",
            }}
          >
            {loading ? (
              <div style={{
                width: "12px", height: "12px", borderRadius: "50%",
                border: `2px solid ${MUTED}`, borderTopColor: LIME,
                animation: "spin 0.7s linear infinite",
              }} />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                  stroke={!input.trim() ? MUTED : DARK}
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 2px; }
      `}</style>
    </div>
  );
}