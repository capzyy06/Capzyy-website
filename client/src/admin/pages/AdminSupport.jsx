import { useState, useEffect, useRef } from "react";
import { supportApi, connectSocket, disconnectSocket } from "../../store/api/supportApi";

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { day: "numeric", month: "short" });
};

function MessageBubble({ msg }) {
  const isAdmin = msg.senderRole === "admin";
  return (
    <div style={{ display: "flex", justifyContent: isAdmin ? "flex-end" : "flex-start", marginBottom: "10px" }}>
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: isAdmin ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
          background: isAdmin ? "linear-gradient(135deg, #e2b96f, #c9973a)" : "#1a1a2e",
          color: isAdmin ? "#1a1a2e" : "#e2b96f",
          fontSize: "13.5px",
          lineHeight: 1.5,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div>{msg.text}</div>
        <div style={{ fontSize: "10px", opacity: 0.55, marginTop: "4px", textAlign: "right" }}>
          {formatTime(msg.createdAt)}
        </div>
      </div>
    </div>
  );
}

export default function AdminSupport() {
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);

  // Load all conversations
  useEffect(() => {
    supportApi.getAllConversations().then(setConversations).catch(console.error);
  }, []);

  // Socket for realtime
  useEffect(() => {
    const socket = connectSocket();
    socket.emit("join_admin");

    socket.on("new_message", (msg) => {
      if (msg.conversation === activeConvo?._id) {
        setMessages((prev) => [...prev, msg]);
      }
      setConversations((prev) =>
        prev.map((c) =>
          c._id === msg.conversation
            ? {
                ...c,
                lastMessage: msg.text.slice(0, 80),
                lastMessageAt: msg.createdAt,
                unreadByAdmin: msg.senderRole === "user" ? (c.unreadByAdmin || 0) + 1 : c.unreadByAdmin,
              }
            : c
        )
      );
    });

    socket.on("conversation_updated", ({ conversationId, lastMessage, lastMessageAt }) => {
      setConversations((prev) =>
        prev.map((c) => (c._id === conversationId ? { ...c, lastMessage, lastMessageAt } : c))
      );
    });

    return () => {
      socket.off("new_message");
      socket.off("conversation_updated");
      disconnectSocket();
    };
  }, [activeConvo]);

  // Open a conversation
  const openConvo = async (convo) => {
    setActiveConvo(convo);
    setMessages([]);
    try {
      const msgs = await supportApi.getMessages(convo._id);
      setMessages(msgs);
      // Mark as read
      await supportApi.markAsRead(convo._id);
      setConversations((prev) =>
        prev.map((c) => (c._id === convo._id ? { ...c, unreadByAdmin: 0 } : c))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const sendReply = async () => {
    if (!input.trim() || loading || !activeConvo) return;
    setLoading(true);
    try {
      await supportApi.sendMessage(activeConvo._id, input);
      setInput("");
    } catch (e) {
      alert(e.response?.data?.message || "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filtered = conversations.filter((c) =>
    (c.user?.name || c.user?.email || "").toLowerCase().includes(search.toLowerCase())
  );
  const unread = filtered.filter((c) => c.unreadByAdmin > 0);
  const read = filtered.filter((c) => !c.unreadByAdmin);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        background: "#f0ece6",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "320px",
          background: "#1a1a2e",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #2a2a4a",
          flexShrink: 0,
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid #2a2a4a" }}>
          <div style={{ color: "#e2b96f", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.02em" }}>
            🧢 Support Inbox
          </div>
          <div style={{ color: "#ffffff44", fontSize: "12px", marginTop: "2px" }}>
            {unread.length} unread conversation{unread.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: "12px 14px" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "10px",
              border: "1px solid #2a2a4a",
              background: "#12122a",
              color: "#fff",
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Conversation List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Unread */}
          {unread.length > 0 && (
            <>
              <div style={{ padding: "8px 16px 4px", fontSize: "10px", fontWeight: 700, color: "#e2b96f66", letterSpacing: "0.1em" }}>
                UNREAD
              </div>
              {unread.map((c) => (
                <ConvoRow key={c._id} convo={c} active={activeConvo?._id === c._id} onClick={() => openConvo(c)} />
              ))}
            </>
          )}

          {/* Read */}
          {read.length > 0 && (
            <>
              <div style={{ padding: "12px 16px 4px", fontSize: "10px", fontWeight: 700, color: "#ffffff33", letterSpacing: "0.1em" }}>
                ALL CHATS
              </div>
              {read.map((c) => (
                <ConvoRow key={c._id} convo={c} active={activeConvo?._id === c._id} onClick={() => openConvo(c)} />
              ))}
            </>
          )}

          {filtered.length === 0 && (
            <div style={{ color: "#ffffff33", textAlign: "center", marginTop: "40px", fontSize: "13px" }}>
              No conversations yet
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activeConvo ? (
          <>
            {/* Chat Header */}
            <div
              style={{
                padding: "16px 24px",
                background: "#fff",
                borderBottom: "1px solid #ede7dc",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #e2b96f, #c9973a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1a1a2e",
                  fontWeight: 800,
                  fontSize: "16px",
                  flexShrink: 0,
                }}
              >
                {(activeConvo.user?.name || activeConvo.user?.email || "?")[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "15px" }}>
                  {activeConvo.user?.name || activeConvo.user?.email || "Unknown User"}
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>{activeConvo.user?.email}</div>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  fontSize: "11px",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  background: activeConvo.status === "open" ? "#e8f8f0" : "#f0f0f0",
                  color: activeConvo.status === "open" ? "#27ae60" : "#999",
                  fontWeight: 700,
                }}
              >
                {activeConvo.status?.toUpperCase()}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              {messages.map((msg) => (
                <MessageBubble key={msg._id} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Box */}
            <div
              style={{
                padding: "14px 20px",
                borderTop: "1px solid #ede7dc",
                color: "#1a1a2e", 
                background: "#fff",
                display: "flex",
                gap: "10px",
                alignItems: "flex-end",
              }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendReply();
                  }
                }}
                placeholder="Type your reply... (Enter to send)"
                rows={2}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "1.5px solid #ede7dc",
                  fontSize: "13.5px",
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                }}
              />
              <button
                onClick={sendReply}
                disabled={loading || !input.trim()}
                style={{
                  padding: "10px 20px",
                  borderRadius: "12px",
                  background:
                    loading || !input.trim()
                      ? "#ddd"
                      : "linear-gradient(135deg, #e2b96f, #c9973a)",
                  border: "none",
                  color: loading || !input.trim() ? "#999" : "#1a1a2e",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                }}
              >
                {loading ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#ccc",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>💬</div>
            <div style={{ fontWeight: 700, fontSize: "18px", color: "#aaa" }}>
              Select a conversation
            </div>
            <div style={{ fontSize: "13px", marginTop: "6px" }}>
              Pick a chat from the sidebar to start replying
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sidebar row component
function ConvoRow({ convo, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px 16px",
        cursor: "pointer",
        background: active ? "#12122a" : "transparent",
        borderLeft: active ? "3px solid #e2b96f" : "3px solid transparent",
        transition: "background 0.15s",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#12122a66"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #e2b96f55, #c9973a55)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#e2b96f",
          fontWeight: 800,
          fontSize: "15px",
          flexShrink: 0,
        }}
      >
        {(convo.user?.name || convo.user?.email || "?")[0].toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>
            {convo.user?.name || convo.user?.email || "Unknown"}
          </div>
          <div style={{ color: "#ffffff44", fontSize: "10px", flexShrink: 0 }}>
            {formatTime(convo.lastMessageAt)}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
          <div style={{ color: "#ffffff55", fontSize: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>
            {convo.lastMessage || "No messages yet"}
          </div>
          {convo.unreadByAdmin > 0 && (
            <div
              style={{
                background: "#e2b96f",
                color: "#1a1a2e",
                borderRadius: "10px",
                padding: "1px 7px",
                fontSize: "10px",
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {convo.unreadByAdmin}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}