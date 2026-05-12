import { useState } from "react";
import SupportChatBox from "./SupportChatBox";

export default function SupportWidget({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Support Chat"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          border: "2px solid #e2b96f",
          boxShadow: "0 4px 24px rgba(226,185,111,0.25)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 6px 32px rgba(226,185,111,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(226,185,111,0.25)";
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          {open ? (
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="#e2b96f"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <>
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="#e2b96f"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>
      </button>

      {/* Chat Box */}
      {open && <SupportChatBox user={user} onClose={() => setOpen(false)} />}
    </>
  );
}