import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, model = "claude-sonnet-4-6", max_tokens = 1024 } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Messages are required" });
    }

    const response = await client.messages.create({
      model,
      max_tokens,
      messages,
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Claude API error:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
      details: error.status,
    });
  }
}
