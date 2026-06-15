import "./globals.css";

export const metadata = {
  title: "AI Cold Call Trainer",
  description: "Practice sales pitches against AI prospects. Live coaching and full analysis after every call.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
