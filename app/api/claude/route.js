import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, system, max_tokens = 1000 } = body;

    // Use server environment variable or client header override
    const apiKey = process.env.ANTHROPIC_API_KEY || req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Anthropic API Key missing. Please set ANTHROPIC_API_KEY on Vercel or enter it in app settings." },
        { status: 401 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens,
        system,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData?.error?.message || `API Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    return NextResponse.json({ text });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to call Claude API" }, { status: 500 });
  }
}
