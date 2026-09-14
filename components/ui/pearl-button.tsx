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
          bg: "#240808",
          glowColor: "rgba(239, 68, 68, 0.55)",
          textColor: "#ffffff",
          accentColor: "#fca5a5",
          borderGlow: "rgba(239, 68, 68, 0.45)",
        };
      case "secondary":
      case "ghost":
        return {
          bg: "#111320",
          glowColor: "rgba(255, 255, 255, 0.25)",
          textColor: "#ffffff",
          accentColor: "#a78bfa",
          borderGlow: "rgba(255, 255, 255, 0.25)",
        };
      case "primary":
      default:
        return {
          bg: "#0f1124",
          glowColor: "rgba(129, 140, 248, 0.6)",
          textColor: "#ffffff",
          accentColor: "#818cf8",
          borderGlow: "rgba(129, 140, 248, 0.5)",
        };
    }
  };

  const v = getVariantStyles();

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
            inset 0 0.4rem 0.8rem rgba(255, 255, 255, 0.35),
            inset 0 -0.2rem 0.4rem rgba(0, 0, 0, 0.9),
            inset 0 -0.45rem 1rem var(--btn-glow, rgba(129, 140, 248, 0.5)),
            0 1.2rem 2.5rem rgba(0, 0, 0, 0.5),
            0 0.6rem 1rem -0.2rem rgba(0, 0, 0, 0.9);
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
          font-weight: 800;
          letter-spacing: 0.03em;
          color: #ffffff !important;
          border-radius: inherit;
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Comfortable Padding on all sides & Perfectly Centered Text */
        .pearl-button-sm {
          min-height: 44px;
        }
        .pearl-button-sm .wrap {
          font-size: 14px;
          padding: 12px 28px;
        }

        .pearl-button-md {
          min-height: 56px;
        }
        .pearl-button-md .wrap {
          font-size: 16px;
          padding: 16px 40px;
        }

        .pearl-button-lg {
          min-height: 64px;
        }
        .pearl-button-lg .wrap {
          font-size: 18px;
          padding: 20px 52px;
        }

        .pearl-button .sparkle-2 {
          display: none;
        }
        .pearl-button:hover:not(:disabled) .sparkle-1 {
          display: none;
        }
        .pearl-button:hover:not(:disabled) .sparkle-2 {
          display: inline-block;
        }
        .pearl-button .wrap p {
          position: relative;
          z-index: 10;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          margin: 0 auto;
          font-weight: 800;
          color: #ffffff !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.95), 0 0 12px rgba(255, 255, 255, 0.2);
          transition: all 0.2s ease;
        }

        .pearl-button .wrap::before,
        .pearl-button .wrap::after {
          content: "";
          position: absolute;
          transition: all 0.3s ease;
          pointer-events: none;
          z-index: 1;
        }
        .pearl-button .wrap::before {
          left: -15%;
          right: -15%;
          bottom: 25%;
          top: -100%;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.18);
        }
        .pearl-button .wrap::after {
          left: 6%;
          right: 6%;
          top: 10%;
          bottom: 40%;
          border-radius: 22px 22px 0 0;
          box-shadow: inset 0 12px 12px -6px rgba(255, 255, 255, 0.8);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.45) 0%,
            rgba(0, 0, 0, 0) 60%,
            rgba(0, 0, 0, 0) 100%
          );
        }

        .pearl-button:hover:not(:disabled) {
          box-shadow:
            inset 0 0.4rem 0.8rem rgba(255, 255, 255, 0.6),
            inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.9),
            inset 0 -0.5rem 1.1rem var(--btn-glow, rgba(129, 140, 248, 0.65)),
            0 1.6rem 2.8rem rgba(0, 0, 0, 0.6),
            0 0.8rem 1.2rem -0.2rem var(--btn-border-glow, rgba(129, 140, 248, 0.45));
          transform: translateY(-3px);
        }
        .pearl-button:hover:not(:disabled) .wrap::before {
          transform: translateY(-6%);
        }
        .pearl-button:hover:not(:disabled) .wrap::after {
          opacity: 0.65;
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
      `,
        }}
      />

      <button
        className={`pearl-button pearl-button-${{ small: "sm", medium: "md", large: "lg" }[size as string] || size || "md"} ${className}`}
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
            <span style={{ position: "absolute", right: "100%", marginRight: "12px", display: "inline-flex", alignItems: "center" }}>
              <span className="sparkle-1" style={{ color: v.accentColor, fontSize: "1.05em" }}>✧</span>
              <span className="sparkle-2" style={{ color: v.accentColor, fontSize: "1.05em" }}>✦</span>
              {icon && <span style={{ display: "inline-flex", marginLeft: "6px" }}>{icon}</span>}
            </span>
            <span>{contentText}</span>
          </p>
        </div>
      </button>
    </>
  );
};
