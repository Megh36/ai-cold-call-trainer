import React from "react";

export type PearlButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
};

export const PearlButton: React.FC<PearlButtonProps> = ({
  children,
  label,
  className = "",
  variant = "primary",
  size = "medium",
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
          glowColor: "rgba(239, 68, 68, 0.4)",
          textColor: "#fca5a5",
          accentColor: "#ef4444",
          borderGlow: "rgba(239, 68, 68, 0.3)",
        };
      case "secondary":
      case "ghost":
        return {
          bg: "#0d0e15",
          glowColor: "rgba(255, 255, 255, 0.15)",
          textColor: "rgba(240, 240, 245, 0.85)",
          accentColor: "#818cf8",
          borderGlow: "rgba(255, 255, 255, 0.15)",
        };
      case "primary":
      default:
        return {
          bg: "#0b0c16",
          glowColor: "rgba(129, 140, 248, 0.4)",
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
            inset 0 0.25rem 0.6rem rgba(255, 255, 255, 0.25),
            inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.8),
            inset 0 -0.3rem 0.7rem var(--btn-glow, rgba(129, 140, 248, 0.3)),
            0 0.8rem 1.5rem rgba(0, 0, 0, 0.4),
            0 0.4rem 0.6rem -0.2rem rgba(0, 0, 0, 0.8);
          user-select: none;
        }
        .pearl-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          filter: grayscale(40%);
          box-shadow: none !important;
          transform: none !important;
        }
        .pearl-button .wrap {
          font-weight: 600;
          color: var(--btn-text, rgba(255, 255, 255, 0.9));
          border-radius: inherit;
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pearl-button-sm .wrap {
          font-size: 13px;
          padding: 8px 18px;
        }
        .pearl-button-md .wrap {
          font-size: 15px;
          padding: 12px 28px;
        }
        .pearl-button-lg .wrap {
          font-size: 18px;
          padding: 16px 36px;
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
          gap: 8px;
          margin: 0;
          transition: all 0.2s ease;
          transform: translateY(1%);
          -webkit-mask-image: linear-gradient(to bottom, white 55%, rgba(255, 255, 255, 0.7));
                  mask-image: linear-gradient(to bottom, white 55%, rgba(255, 255, 255, 0.7));
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
          background-color: rgba(255, 255, 255, 0.14);
        }
        .pearl-button .wrap::after {
          left: 6%;
          right: 6%;
          top: 10%;
          bottom: 40%;
          border-radius: 22px 22px 0 0;
          box-shadow: inset 0 8px 8px -6px rgba(255, 255, 255, 0.7);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.35) 0%,
            rgba(0, 0, 0, 0) 60%,
            rgba(0, 0, 0, 0) 100%
          );
        }
        .pearl-button:hover:not(:disabled) {
          box-shadow:
            inset 0 0.3rem 0.6rem rgba(255, 255, 255, 0.45),
            inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.8),
            inset 0 -0.4rem 0.9rem var(--btn-glow, rgba(129, 140, 248, 0.5)),
            0 1.2rem 2rem rgba(0, 0, 0, 0.5),
            0 0.5rem 0.8rem -0.2rem var(--btn-border-glow, rgba(129, 140, 248, 0.3));
          transform: translateY(-1px);
        }
        .pearl-button:hover:not(:disabled) .wrap::before {
          transform: translateY(-6%);
        }
        .pearl-button:hover:not(:disabled) .wrap::after {
          opacity: 0.55;
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
          //@ts-ignore
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
            <span style={{ color: v.accentColor, fontSize: "0.85em" }}>✧</span>
            <span style={{ color: v.accentColor, fontSize: "0.85em" }}>✦</span>
            {icon && <span style={{ display: "inline-flex", marginRight: "2px" }}>{icon}</span>}
            {contentText}
          </p>
        </div>
      </button>
    </>
  );
};
