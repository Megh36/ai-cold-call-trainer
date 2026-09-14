import React from "react";

export const PearlButton = ({
  children,
  label,
  className = "",
  variant = "primary", // "primary" | "secondary" | "danger" | "ghost"
  size = "medium", // "small" | "medium" | "large"
  icon = null,
  disabled = false,
  style = {},
  onClick,
  ...props
}) => {
  const contentText = label || children;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          bg: "#1c0a0a",
          glowColor: "rgba(239, 68, 68, 0.45)",
          textColor: "#fca5a5",
          accentColor: "#ef4444",
          borderGlow: "rgba(239, 68, 68, 0.35)",
        };
      case "secondary":
      case "ghost":
        return {
          bg: "#0d0e15",
          glowColor: "rgba(255, 255, 255, 0.18)",
          textColor: "rgba(240, 240, 245, 0.95)",
          accentColor: "#818cf8",
          borderGlow: "rgba(255, 255, 255, 0.18)",
        };
      case "primary":
      default:
        return {
          bg: "#0b0c16",
          glowColor: "rgba(129, 140, 248, 0.45)",
          textColor: "#ffffff",
          accentColor: "#818cf8",
          borderGlow: "rgba(129, 140, 248, 0.4)",
        };
    }
  };

  const v = getVariantStyles();

  return (
    <>
      <style>{`
        .pearl-button {
          --radius: 100px;
          outline: none;
          cursor: pointer;
          border: 0;
          position: relative;
          border-radius: var(--radius);
          background-color: var(--btn-bg, #080808);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            inset 0 0.3rem 0.7rem rgba(255, 255, 255, 0.3),
            inset 0 -0.15rem 0.35rem rgba(0, 0, 0, 0.85),
            inset 0 -0.35rem 0.8rem var(--btn-glow, rgba(129, 140, 248, 0.4)),
            0 1rem 2rem rgba(0, 0, 0, 0.45),
            0 0.5rem 0.8rem -0.2rem rgba(0, 0, 0, 0.85);
          user-select: none;
          text-decoration: none;
        }

        .pearl-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          filter: grayscale(40%);
          box-shadow: none !important;
          transform: none !important;
        }

        .pearl-button .wrap {
          font-weight: 700;
          letter-spacing: 0.01em;
          color: var(--btn-text, rgba(255, 255, 255, 0.95));
          border-radius: inherit;
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Increased Padding on all sides & Improved Font Size */
        .pearl-button-sm .wrap {
          font-size: 14px;
          padding: 12px 24px;
        }
        .pearl-button-md .wrap {
          font-size: 16px;
          padding: 16px 36px;
        }
        .pearl-button-lg .wrap {
          font-size: 20px;
          padding: 22px 48px;
        }

        .pearl-button .wrap p span:nth-child(2) {
          display: none;
        }
        .pearl-button:hover:not(:disabled) .wrap p span:nth-child(1) {
          display: none;
        }
        .pearl-button:hover:not(:disabled) .wrap p span:nth-child(2) {
          display: inline-block;
        }
        .pearl-button .wrap p {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 0;
          transition: all 0.2s ease;
          transform: translateY(1%);
          -webkit-mask-image: linear-gradient(to bottom, white 60%, rgba(255, 255, 255, 0.8));
                  mask-image: linear-gradient(to bottom, white 60%, rgba(255, 255, 255, 0.8));
        }

        .pearl-button .wrap::before,
        .pearl-button .wrap::after {
          content: "";
          position: absolute;
          transition: all 0.3s ease;
          pointer-events: none;
        }
        .pearl-button .wrap::before {
          left: -15%;
          right: -15%;
          bottom: 25%;
          top: -100%;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.16);
        }
        .pearl-button .wrap::after {
          left: 6%;
          right: 6%;
          top: 10%;
          bottom: 40%;
          border-radius: 22px 22px 0 0;
          box-shadow: inset 0 10px 10px -6px rgba(255, 255, 255, 0.75);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(0, 0, 0, 0) 60%,
            rgba(0, 0, 0, 0) 100%
          );
        }

        .pearl-button:hover:not(:disabled) {
          box-shadow:
            inset 0 0.35rem 0.7rem rgba(255, 255, 255, 0.5),
            inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.85),
            inset 0 -0.45rem 1rem var(--btn-glow, rgba(129, 140, 248, 0.55)),
            0 1.4rem 2.2rem rgba(0, 0, 0, 0.55),
            0 0.6rem 1rem -0.2rem var(--btn-border-glow, rgba(129, 140, 248, 0.35));
          transform: translateY(-2px);
        }
        .pearl-button:hover:not(:disabled) .wrap::before {
          transform: translateY(-6%);
        }
        .pearl-button:hover:not(:disabled) .wrap::after {
          opacity: 0.6;
          transform: translateY(4%);
        }
        .pearl-button:hover:not(:disabled) .wrap p {
          transform: translateY(-3%);
        }
        .pearl-button:active:not(:disabled) {
          transform: translateY(3px);
          box-shadow:
            inset 0 0.2rem 0.4rem rgba(255, 255, 255, 0.5),
            inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.9),
            inset 0 -0.3rem 0.7rem var(--btn-glow, rgba(129, 140, 248, 0.4)),
            0 0.4rem 0.8rem rgba(0, 0, 0, 0.4);
        }
      `}</style>

      <button
        className={`pearl-button pearl-button-${size} ${className}`}
        disabled={disabled}
        onClick={onClick}
        style={{
          "--btn-bg": v.bg,
          "--btn-glow": v.glowColor,
          "--btn-text": v.textColor,
          "--btn-border-glow": v.borderGlow,
          ...style,
        }}
        {...props}
      >
        <div className="wrap">
          <p>
            <span style={{ color: v.accentColor, fontSize: "0.9em" }}>✧</span>
            <span style={{ color: v.accentColor, fontSize: "0.9em" }}>✦</span>
            {icon && <span style={{ display: "inline-flex", marginRight: "3px" }}>{icon}</span>}
            {contentText}
          </p>
        </div>
      </button>
    </>
  );
};

export default PearlButton;
