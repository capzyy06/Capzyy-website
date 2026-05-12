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

const styles = {
  wrap: {
    display: "flex",
    height: "100dvh",
    fontFamily: "'Inter', 'DM Sans', sans-serif",
    background: "#f7f5f2",
    overflow: "hidden",
    position: "relative",
  },
  // ── Sidebar ──────────────────────────────────────────────
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 40,
  },
  sidebar: (open) => ({
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: "min(300px, 88vw)",
    background: "#0f0f1e",
    display: "flex",
    flexDirection: "column",
    zIndex: 50,
    transform: open ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.28s cubic-bezier(.4,0,.2,1)",
    boxShadow: open ? "4px 0 24px rgba(0,0,0,0.35)" : "none",
  }),
  sidebarDesktop: {
    position: "relative",
    height: "100%",
    width: "300px",
    background: "#0f0f1e",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    transform: "none",
    boxShadow: "none",
    zIndex: "auto",
    borderRight: "1px solid rgba(255,255,255,0.06)",
  },
  sbHead: {
    padding: "20px 16px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  sbTitle: {
    color: "#d4a853",
    fontWeight: 700,
    fontSize: "17px",
    letterSpacing: "-0.01em",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sbSubtitle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: "12px",
    marginTop: "3px",
  },
  searchWrap: {
    padding: "12px 14px",
  },
  searchInput: {
    width: "100%",
    padding: "9px 12px 9px 36px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  searchWrapInner: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: "11px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(255,255,255,0.3)",
    fontSize: "14px",
    pointerEvents: "none",
  },
  sectionLabel: {
    padding: "10px 16px 4px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.25)",
    textTransform: "uppercase",
  },
  sectionLabelUnread: {
    padding: "10px 16px 4px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "rgba(212,168,83,0.5)",
    textTransform: "uppercase",
  },
  convoList: {
    flex: 1,
    overflowY: "auto",
  },
  emptyList: {
    color: "rgba(255,255,255,0.2)",
    textAlign: "center",
    marginTop: "48px",
    fontSize: "13px",
  },
  // ── Main ─────────────────────────────────────────────────
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,        // ← lets flex children shrink below content size
    height: "100dvh",   // ← full viewport height always
    overflow: "hidden", // ← clips children; messages div scrolls internally
    background: "#f7f5f2",
  },
  chatHeader: {
    padding: "12px 16px",
    background: "#fff",
    borderBottom: "1px solid #ede9e3",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
    minHeight: "60px",
    flexShrink: 0,      // ← never compress the header
  },
  backBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px 8px 6px 0",
    color: "#d4a853",
    fontSize: "20px",
    lineHeight: 1,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #d4a853, #b8862d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: "15px",
    flexShrink: 0,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  headerName: {
    fontWeight: 600,
    color: "#1a1a2e",
    fontSize: "14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  headerEmail: {
    fontSize: "11.5px",
    color: "#999",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  statusBadge: (status) => ({
    fontSize: "10px",
    padding: "3px 9px",
    borderRadius: "20px",
    background: status === "open" ? "#e6f7ef" : "#f0f0f0",
    color: status === "open" ? "#1d8a55" : "#888",
    fontWeight: 700,
    letterSpacing: "0.04em",
    flexShrink: 0,
    textTransform: "uppercase",
  }),
  messages: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "16px 14px",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  replyBox: {
    padding: "10px 12px",
    borderTop: "1px solid #ede9e3",
    background: "#fff",
    display: "flex",
    gap: "8px",
    alignItems: "flex-end",
    flexShrink: 0,
  },
  textarea: {
    flex: 1,
    padding: "9px 12px",
    borderRadius: "12px",
    border: "1.5px solid #ede9e3",
    fontSize: "13.5px",
    resize: "none",
    outline: "none",
    fontFamily: "inherit",
    lineHeight: 1.5,
    background: "#faf9f7",
    color: "#1a1a2e",
  },
  sendBtn: (disabled) => ({
    padding: "9px 16px",
    borderRadius: "12px",
    background: disabled ? "#e8e5e1" : "linear-gradient(135deg, #d4a853, #b8862d)",
    border: "none",
    color: disabled ? "#aaa" : "#fff",
    fontWeight: 700,
    fontSize: "13px",
    cursor: disabled ? "not-allowed" : "pointer",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
    flexShrink: 0,
  }),
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#bbb",
    gap: "8px",
    padding: "24px",
  },
  emptyIcon: {
    fontSize: "56px",
    marginBottom: "8px",
  },
  emptyTitle: {
    fontWeight: 600,
    fontSize: "17px",
    color: "#aaa",
  },
  emptyBody: {
    fontSize: "13px",
    color: "#ccc",
    textAlign: "center",
  },
  hamburgerBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px 8px",
    color: "#1a1a2e",
    fontSize: "22px",
    lineHeight: 1,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
  },
};

// ── Message Bubble ────────────────────────────────────────
function MessageBubble({ msg }) {
  const isAdmin = msg.senderRole === "admin";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isAdmin ? "flex-end" : "flex-start",
        marginBottom: "8px",
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "9px 13px",
          borderRadius: isAdmin ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
          background: isAdmin ? "#1a1a2e" : "#fff",
          color: isAdmin ? "#d4a853" : "#1a1a2e",
          fontSize: "13.5px",
          lineHeight: 1.55,
          border: isAdmin ? "none" : "0.5px solid #ede9e3",
        }}
      >
        <div>{msg.text}</div>
        <div
          style={{
            fontSize: "10px",
            opacity: 0.5,
            marginTop: "4px",
            textAlign: "right",
          }}
        >
          {formatTime(msg.createdAt)}
        </div>
      </div>
    </div>
  );
}

// ── Sidebar Row ───────────────────────────────────────────
function ConvoRow({ convo, active, onClick }) {
  const initial = (convo.user?.name || convo.user?.email || "?")[0].toUpperCase();
  return (
    <div
      onClick={onClick}
      style={{
        padding: "11px 14px",
        cursor: "pointer",
        background: active ? "rgba(212,168,83,0.1)" : "transparent",
        borderLeft: active ? "3px solid #d4a853" : "3px solid transparent",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        transition: "background 0.15s",
      }}
    >
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          background: "rgba(212,168,83,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#d4a853",
          fontWeight: 700,
          fontSize: "14px",
          flexShrink: 0,
        }}
      >
        {initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <div
            style={{
              color: active ? "#d4a853" : "#fff",
              fontWeight: 600,
              fontSize: "13px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {convo.user?.name || convo.user?.email || "Unknown"}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "10px",
              flexShrink: 0,
            }}
          >
            {formatTime(convo.lastMessageAt)}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "2px",
            gap: "6px",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.38)",
              fontSize: "12px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {convo.lastMessage || "No messages yet"}
          </div>
          {convo.unreadByAdmin > 0 && (
            <div
              style={{
                background: "#d4a853",
                color: "#1a1a2e",
                borderRadius: "20px",
                padding: "1px 7px",
                fontSize: "10px",
                fontWeight: 800,
                flexShrink: 0,
                minWidth: "18px",
                textAlign: "center",
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

// ── Main Component ────────────────────────────────────────
export default function AdminSupport() {
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const messagesEndRef = useRef(null);

  // Responsive detection
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
                unreadByAdmin:
                  msg.senderRole === "user"
                    ? (c.unreadByAdmin || 0) + 1
                    : c.unreadByAdmin,
              }
            : c
        )
      );
    });

    socket.on("conversation_updated", ({ conversationId, lastMessage, lastMessageAt }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId ? { ...c, lastMessage, lastMessageAt } : c
        )
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
    setSidebarOpen(false); // close drawer on mobile
    try {
      const msgs = await supportApi.getMessages(convo._id);
      setMessages(msgs);
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

  // ── Sidebar Content ──
  const SidebarContent = (
    <>
      <div style={styles.sbHead}>
        <div style={styles.sbTitle}>
          <span>🧢</span>
          <span>Support Inbox</span>
        </div>
        <div style={styles.sbSubtitle}>
          {unread.length} unread conversation{unread.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div style={styles.searchWrap}>
        <div style={styles.searchWrapInner}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.convoList}>
        {unread.length > 0 && (
          <>
            <div style={styles.sectionLabelUnread}>Unread</div>
            {unread.map((c) => (
              <ConvoRow
                key={c._id}
                convo={c}
                active={activeConvo?._id === c._id}
                onClick={() => openConvo(c)}
              />
            ))}
          </>
        )}
        {read.length > 0 && (
          <>
            <div style={styles.sectionLabel}>All Chats</div>
            {read.map((c) => (
              <ConvoRow
                key={c._id}
                convo={c}
                active={activeConvo?._id === c._id}
                onClick={() => openConvo(c)}
              />
            ))}
          </>
        )}
        {filtered.length === 0 && (
          <div style={styles.emptyList}>No conversations yet</div>
        )}
      </div>
    </>
  );

  // On mobile, hide sidebar when a chat is open (full-screen chat)
  const showMobileChat = isMobile && activeConvo;

  return (
    <div style={styles.wrap}>
      {/* Desktop sidebar — always visible on wide screens */}
      {!isMobile && (
        <div style={styles.sidebarDesktop}>{SidebarContent}</div>
      )}

      {/* Mobile sidebar — drawer */}
      {isMobile && (
        <>
          {sidebarOpen && (
            <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
          )}
          <div style={styles.sidebar(sidebarOpen)}>{SidebarContent}</div>
        </>
      )}

      {/* Main area */}
      <div
        style={{
          ...styles.main,
          // On mobile with chat open, take full width; otherwise show list hints
          display: isMobile && !activeConvo ? "flex" : "flex",
        }}
      >
        {activeConvo ? (
          <>
            {/* Chat Header */}
            <div style={styles.chatHeader}>
              {/* Back button on mobile */}
              {isMobile && (
                <button
                  style={styles.backBtn}
                  onClick={() => setActiveConvo(null)}
                  aria-label="Back to conversations"
                >
                  ←
                </button>
              )}

              {/* Hamburger for desktop sidebar (desktop shows sidebar, but keep for consistency) */}
              {!isMobile && null}

              <div style={styles.avatar}>
                {(activeConvo.user?.name || activeConvo.user?.email || "?")[0].toUpperCase()}
              </div>

              <div style={styles.headerInfo}>
                <div style={styles.headerName}>
                  {activeConvo.user?.name || activeConvo.user?.email || "Unknown User"}
                </div>
                <div style={styles.headerEmail}>{activeConvo.user?.email}</div>
              </div>

              <div style={styles.statusBadge(activeConvo.status)}>
                {activeConvo.status}
              </div>
            </div>

            {/* Messages */}
            <div style={styles.messages}>
              {messages.map((msg) => (
                <MessageBubble key={msg._id} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Box */}
            <div style={styles.replyBox}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendReply();
                  }
                }}
                placeholder="Type your reply…"
                rows={2}
                style={styles.textarea}
              />
              <button
                onClick={sendReply}
                disabled={loading || !input.trim()}
                style={styles.sendBtn(loading || !input.trim())}
              >
                {loading ? "…" : "Send"}
              </button>
            </div>
          </>
        ) : (
          /* Empty / list state */
          <>
            {/* Mobile top bar (no active chat) */}
            {isMobile && (
              <div
                style={{
                  ...styles.chatHeader,
                  justifyContent: "space-between",
                }}
              >
                <button
                  style={styles.hamburgerBtn}
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open conversations"
                >
                  ☰
                </button>
                <span
                  style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a2e" }}
                >
                  Support Inbox
                </span>
                <div style={{ width: "32px" }} />
              </div>
            )}

            {/* On mobile, show conversation list inline when no chat active */}
            {isMobile ? (
              <div style={{ flex: 1, overflowY: "auto", minHeight: 0, background: "#f7f5f2" }}>
                {unread.length > 0 && (
                  <>
                    <div
                      style={{
                        padding: "14px 16px 4px",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "#b8862d",
                        textTransform: "uppercase",
                      }}
                    >
                      Unread
                    </div>
                    {unread.map((c) => (
                      <MobileConvoRow
                        key={c._id}
                        convo={c}
                        onClick={() => openConvo(c)}
                      />
                    ))}
                  </>
                )}
                {read.length > 0 && (
                  <>
                    <div
                      style={{
                        padding: "14px 16px 4px",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "#999",
                        textTransform: "uppercase",
                      }}
                    >
                      All Chats
                    </div>
                    {read.map((c) => (
                      <MobileConvoRow
                        key={c._id}
                        convo={c}
                        onClick={() => openConvo(c)}
                      />
                    ))}
                  </>
                )}
                {filtered.length === 0 && (
                  <div style={{ ...styles.emptyState }}>
                    <div style={styles.emptyIcon}>💬</div>
                    <div style={styles.emptyTitle}>No conversations</div>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>💬</div>
                <div style={styles.emptyTitle}>Select a conversation</div>
                <div style={styles.emptyBody}>
                  Pick a chat from the sidebar to start replying
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Mobile Conversation Row (light bg) ───────────────────
function MobileConvoRow({ convo, onClick }) {
  const initial = (convo.user?.name || convo.user?.email || "?")[0].toUpperCase();
  return (
    <div
      onClick={onClick}
      style={{
        padding: "13px 16px",
        cursor: "pointer",
        background: "#fff",
        borderBottom: "0.5px solid #ede9e3",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #d4a853, #b8862d)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
          fontSize: "15px",
          flexShrink: 0,
        }}
      >
        {initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <div
            style={{
              color: "#1a1a2e",
              fontWeight: 600,
              fontSize: "14px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {convo.user?.name || convo.user?.email || "Unknown"}
          </div>
          <div style={{ color: "#bbb", fontSize: "11px", flexShrink: 0 }}>
            {formatTime(convo.lastMessageAt)}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "2px",
            gap: "6px",
          }}
        >
          <div
            style={{
              color: "#999",
              fontSize: "12.5px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {convo.lastMessage || "No messages yet"}
          </div>
          {convo.unreadByAdmin > 0 && (
            <div
              style={{
                background: "#d4a853",
                color: "#fff",
                borderRadius: "20px",
                padding: "2px 8px",
                fontSize: "10px",
                fontWeight: 800,
                flexShrink: 0,
                minWidth: "20px",
                textAlign: "center",
              }}
            >
              {convo.unreadByAdmin}
            </div>
          )}
        </div>
      </div>
      <span style={{ color: "#ddd", fontSize: "16px", flexShrink: 0 }}>›</span>
    </div>
  );
}