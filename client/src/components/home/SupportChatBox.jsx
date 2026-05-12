import { useState, useEffect, useRef } from "react";
import { supportApi, connectSocket, disconnectSocket } from "../../store/api/supportApi";

const LIME = "#C8F135";
const DARK = "#0a0a0a";
const SURFACE = "#141414";
const SURFACE2 = "#1C1C1C";
const BORDER = "#2A2A2A";
const TEXT = "#F5F0E8";
const MUTED = "#888888";

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const PRESET_QUESTIONS = [
  { label: "📦 Delivery issue", text: "I have a problem with my delivery." },
  { label: "↩️ Return request", text: "I'd like to request a return." },
  { label: "📏 Size help", text: "I need help choosing the right size." },
  { label: "💳 Payment issue", text: "I have a payment-related question." },
];

const FAQ_ITEMS = [
  { q: "How long does delivery take?", a: "We deliver within 6–7 working days across India." },
  { q: "What is your return policy?", a: "We currently do not accept returns. Please reach out before ordering if you have size concerns." },
  { q: "How do I track my order?", a: "Check your email for a tracking link, or visit the Orders section in your account." },
];

function MessageBubble({ msg }) {
  const isAdmin = msg.senderRole === "admin";
  return (
    <div style={{ display: "flex", justifyContent: isAdmin ? "flex-start" : "flex-end", marginBottom: "10px" }}>
      <div style={{
        maxWidth: "75%", padding: "10px 14px",
        borderRadius: isAdmin ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
        background: isAdmin ? SURFACE2 : LIME,
        color: isAdmin ? TEXT : DARK,
        fontSize: "13.5px", lineHeight: "1.5",
        border: `1px solid ${isAdmin ? BORDER : "transparent"}`,
      }}>
        {isAdmin && (
          <div style={{ fontSize: "10px", color: LIME, marginBottom: "3px", fontWeight: 700, letterSpacing: "0.08em" }}>
            CAPZYY SUPPORT
          </div>
        )}
        <div>{msg.text}</div>
        <div style={{ fontSize: "10px", opacity: 0.5, marginTop: "4px", textAlign: "right", color: isAdmin ? MUTED : DARK }}>
          {formatTime(msg.createdAt)}
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div style={{ padding: "0 16px 8px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: LIME, letterSpacing: "0.1em", marginBottom: "8px" }}>
        QUICK ANSWERS
      </div>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} style={{ borderRadius: "6px", background: SURFACE2, marginBottom: "6px", overflow: "hidden", border: `1px solid ${BORDER}` }}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            style={{ width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: TEXT, display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            {item.q}
            <span style={{ color: LIME, fontSize: "16px" }}>{openIdx === i ? "−" : "+"}</span>
          </button>
          {openIdx === i && (
            <div style={{ padding: "0 12px 10px", fontSize: "12.5px", color: MUTED, lineHeight: 1.5, borderTop: `1px solid ${BORDER}` }}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function LoginPrompt() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center" }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔒</div>
      <div style={{ fontWeight: 700, fontSize: "16px", color: TEXT, marginBottom: "8px" }}>Login to chat with us</div>
      <div style={{ fontSize: "13px", color: MUTED, lineHeight: 1.5, marginBottom: "20px" }}>
        Sign in to get real-time support from our team.
      </div>
      <a href="/login" style={{ background: LIME, color: DARK, fontWeight: 700, padding: "10px 28px", borderRadius: "4px", textDecoration: "none", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Sign In
      </a>
    </div>
  );
}

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
      } catch (e) {
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
  if (!text?.trim() || loading) return; // ← removed !conversationId check
  setError("");
  setLoading(true);
  try {
    // If no conversation yet, create one first
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
      position: "fixed", bottom: "92px", right: "24px",
      width: "360px", height: "520px", borderRadius: "12px",
      background: LIME, boxShadow: `0 16px 64px rgba(0,0,0,0.6), 0 0 0 1px ${BORDER}`,
      display: "flex", flexDirection: "column", overflow: "hidden",
      zIndex: 999, fontFamily: "'Barlow Condensed', sans-serif",
      border: `1px solid ${BORDER}`,
    }}>

      {/* Header */}
      <div style={{ background: SURFACE, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: LIME, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
            🧢
          </div>
          <div>
            <div style={{ color: TEXT, fontWeight: 700, fontSize: "14px", letterSpacing: "0.05em" }}>CAPZYY SUPPORT</div>
            <div style={{ color: MUTED, fontSize: "11px", letterSpacing: "0.05em" }}>Usually replies in minutes</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: "20px", lineHeight: 1, padding: "4px", transition: "color 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.color = TEXT}
          onMouseLeave={(e) => e.currentTarget.style.color = MUTED}>
          ×
        </button>
      </div>

      {/* Tabs */}
      {user && (
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
          {["faq", "chat"].map((tab) => (
            <button key={tab} onClick={() => setView(tab)}
              style={{
                flex: 1, padding: "10px", fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                border: "none", background: "none", cursor: "pointer",
                color: view === tab ? LIME : MUTED,
                borderBottom: view === tab ? `2px solid ${LIME}` : "2px solid transparent",
                transition: "all 0.15s",
              }}>
              {tab === "faq" ? "📖 FAQ" : "💬 Chat"}
            </button>
          ))}
        </div>
      )}

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", background: LIME }}>
        {!user ? (
          <LoginPrompt />
        ) : view === "faq" ? (
          <div style={{ padding: "12px 0" }}>
            <FAQSection />
            <div style={{ padding: "0 16px", marginTop: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: LIME, letterSpacing: "0.1em", marginBottom: "8px" }}>
                QUICK QUESTIONS
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {PRESET_QUESTIONS.map((pq) => (
                  <button key={pq.label} onClick={() => handlePreset(pq.text)}
                    style={{ padding: "6px 12px", borderRadius: "4px", border: `1.5px solid ${BORDER}`, background: SURFACE2, color: TEXT, fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.03em" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = LIME; e.currentTarget.style.color = LIME; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = TEXT; }}>
                    {pq.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
            {convoLoading ? (
              <div style={{ textAlign: "center", color: MUTED, fontSize: "13px", marginTop: "40px" }}>Loading messages...</div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: "center", color: MUTED, fontSize: "13px", marginTop: "40px" }}>No messages yet. Say hello! 👋</div>
            ) : (
              messages.map((msg) => <MessageBubble key={msg._id} msg={msg} currentUserId={user?._id} />)
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "6px 16px", background: "#2a0a0a", color: "#ff6b6b", fontSize: "12px", borderTop: `1px solid #3a1a1a` }}>
          {error}
        </div>
      )}

      {/* Input */}
      {user && (
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: "8px", background: SURFACE, alignItems: "center" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder={convoLoading ? "Loading..." : "Type a message..."}
            disabled={loading}
            style={{
              flex: 1, padding: "10px 14px", borderRadius: "6px",
              border: `1.5px solid ${BORDER}`, background: SURFACE2,
              color: TEXT, fontSize: "13px", outline: "none",
              fontFamily: "inherit", letterSpacing: "0.02em",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = LIME}
            onBlur={(e) => e.target.style.borderColor = BORDER}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              width: "38px", height: "38px", borderRadius: "6px",
              background: loading || !input.trim() ? SURFACE2 : LIME,
              border: `1px solid ${loading || !input.trim() ? BORDER : LIME}`,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.2s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                stroke={loading || !input.trim() ? MUTED : DARK}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}