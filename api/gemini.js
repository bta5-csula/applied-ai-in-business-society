const RATE_LIMIT_MAX = 40;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_INPUT_CHARS = 12_000;
const MAX_BODY_BYTES = 64_000;
const GEMINI_TIMEOUT_MS = 30_000;
const RETRYABLE_STATUSES = new Set([500, 502, 503, 504]);
const MAX_TRACKED_CLIENTS = 10_000;

/** @type {Map<string, number[]>} */
const ipTimestamps = new Map();
let lastRateLimitCleanup = 0;

const TECHFLOW_2019_CONTEXT = `TechFlow Industries FY 2019: B2B Bike Manufacturer, $59.6M revenue, $26.5M profit (44.4% margin).
Monthly peak: June $12.1M. 23 customers (US + Germany).
Top customers: Bavaria Bikes $5.48M (ENTERPRISE, pays early), Beantown Bikes $4.07M, Capital Bikes $4.11M.
Payment: 27% early, 7% on-time, 66% late. Avg days late: 3.3. Worst: Furniture City Bikes (87.2% late, 10.7d avg).
Top products: Pro Touring Bike-Silver $7.57M, Road Bike Carbon Shimano $7.2M, Deluxe Touring Bike-Silver $7.39M.
Best margin: Accessories ~55%. Lowest: E-Bike 38.9%.`;

const TECHFLOW_2023_CONTEXT = `TechFlow Industries FY 2023 B2B bike manufacturer, $128.5M revenue, 23 customers, 5,000 transactions, US and Germany.
Key stats: 76.7% late payments, avg 61.5 days over terms for late payers, 37.4% gross margin, 89.6% transactions flagged, 263 SOD violations, 155 threshold avoidance cases.
High-risk customers: Chain Reaction Ltd (172 avg days, 100% late), Crest Cycle Co (154 days, 100%), Velocity Supply (172 days, 100%), Gearhead Supply (163 days, 100%).
Top revenue: RideRight Supply $6.28M, Gravity Sports $6.06M, Velocity Supply $6.08M.
Best product: Elite Road Bike $21.4M (45.3% margin). Worst margin: Carbon Fiber Frame 31.3%, Gravel Explorer 35.9%.`;

const GENERAL_ANSWERING_RULES = `Answer general and off-topic questions, including jokes and weather questions. Do not reject a question merely because it is unrelated to TechFlow. If current or live information is unavailable, say what cannot be verified, then make a serious effort to provide useful non-live information or practical guidance. Keep responses concise. Use 3 to 5 clear bullet points for financial analysis and an appropriate concise format for general questions.`;

const USE_CASE_INSTRUCTIONS = `You are generating a UML use-case diagram. Return only a valid JSON object with no explanation, markdown fences, or backticks.

JSON structure:
{
  "systemName": "Descriptive System Name",
  "actors": [
    {"id": "a1", "name": "Role Name", "side": "left", "type": "human"},
    {"id": "a2", "name": "External System", "side": "bottom", "type": "system"}
  ],
  "usecases": [
    {"id": "uc1", "name": "Verb-noun phrase"}
  ],
  "relationships": [
    {"from": "a1", "to": "uc1", "type": "association"},
    {"from": "uc1", "to": "uc2", "type": "include"},
    {"from": "uc1", "to": "uc3", "type": "extend"},
    {"from": "uc1", "to": "a2", "type": "include"}
  ]
}

Actor rules:
- Human people or roles use type "human" and side "left".
- External systems invoked by the system use type "system" and side "bottom".

Primary use-case rules:
- A primary use case is a standalone top-level goal that an actor directly initiates.
- Connect primary use cases to actors with "association".
- Keep 3 to 6 primary use cases total across all actors.
- Do not split one primary goal into separate add, update, and delete primary use cases. Those are secondary use cases connected with include or extend.
- Do not create use cases for non-functional requirements or internal implementation details.
- Keep secondary use cases to major business sub-behaviors, typically 3 to 8 total.

Relationship rules:
- Include means the sub-step always happens. "from" is the base use case and "to" is the required sub-step.
- Extend means the sub-step happens only under some conditions. "from" is the base use case and "to" is the optional sub-step.
- If distinct actors perform the same action, give each actor a separate use case.
- Adding something is included in managing it.
- Updating and deleting are optional extensions of managing.
- Use-case chains are valid.

List primary use cases first, followed by secondary use cases. Use sentence-case verb-noun names of no more than 8 words. Return only the raw JSON object.`;

const DIAGRAM_RULES = `Return only raw Mermaid diagram code. Do not include an explanation, markdown fences, backticks, HTML, links, click handlers, callbacks, frontmatter, or configuration directives. Keep the diagram static and under 50 nodes and 100 relationships.`;

const FEATURES = Object.freeze({
  "techflow-2019": {
    systemInstruction: `You are a sharp financial analyst for TechFlow Industries. Use the supplied FY 2019 context when it is relevant and cite exact numbers from it.\n\nContext:\n${TECHFLOW_2019_CONTEXT}\n\n${GENERAL_ANSWERING_RULES}`,
    maxOutputTokens: 2048,
  },
  "techflow-2023": {
    systemInstruction: `You are a sharp financial analyst for TechFlow Industries. Use the supplied FY 2023 context when it is relevant and cite exact numbers from it.\n\nContext:\n${TECHFLOW_2023_CONTEXT}\n\n${GENERAL_ANSWERING_RULES}`,
    maxOutputTokens: 2048,
  },
  "diagram-usecase": {
    systemInstruction: USE_CASE_INSTRUCTIONS,
    maxOutputTokens: 3072,
  },
  "diagram-activity": {
    systemInstruction: `Generate a Mermaid flowchart activity diagram. Use rounded boxes for start and end, rectangles for actions, and diamonds for decisions. Start with "flowchart TD". ${DIAGRAM_RULES}`,
    maxOutputTokens: 3072,
  },
  "diagram-class": {
    systemInstruction: `Generate a Mermaid class diagram showing classes, attributes, methods, and relationships. Start with "classDiagram". ${DIAGRAM_RULES}`,
    maxOutputTokens: 3072,
  },
  "diagram-er": {
    systemInstruction: `Generate a Mermaid entity-relationship diagram showing entities, attributes, and relationships. Start with "erDiagram". ${DIAGRAM_RULES}`,
    maxOutputTokens: 3072,
  },
});

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  if (now - lastRateLimitCleanup >= RATE_LIMIT_WINDOW_MS) {
    for (const [trackedIp, trackedTimestamps] of ipTimestamps) {
      const activeTimestamps = trackedTimestamps.filter(
        (timestamp) => timestamp > windowStart,
      );
      if (activeTimestamps.length) ipTimestamps.set(trackedIp, activeTimestamps);
      else ipTimestamps.delete(trackedIp);
    }
    lastRateLimitCleanup = now;
  }

  if (!ipTimestamps.has(ip) && ipTimestamps.size >= MAX_TRACKED_CLIENTS) {
    return false;
  }

  const timestamps = (ipTimestamps.get(ip) || []).filter(
    (timestamp) => timestamp > windowStart,
  );

  if (timestamps.length >= RATE_LIMIT_MAX) {
    ipTimestamps.set(ip, timestamps);
    return false;
  }

  timestamps.push(now);
  ipTimestamps.set(ip, timestamps);
  return true;
}

function requestIsSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;

  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function callGemini(url, apiKey, requestBody) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));
      if (
        !response.ok &&
        attempt === 0 &&
        RETRYABLE_STATUSES.has(response.status)
      ) {
        await wait(250);
        continue;
      }

      return { response, data };
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error("Gemini request did not complete.");
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!requestIsSameOrigin(req)) {
    return res.status(403).json({ error: "Request origin is not allowed." });
  }

  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  if (!contentType.startsWith("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json." });
  }

  const contentLength = Number(req.headers["content-length"] || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Request body is too large." });
  }

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const { feature, userInput } = body;
  const featureConfig = FEATURES[feature];
  if (!featureConfig) {
    return res.status(400).json({ error: "Unknown chatbot feature." });
  }

  if (typeof userInput !== "string" || !userInput.trim()) {
    return res.status(400).json({ error: "Please enter a question or description." });
  }

  if (userInput.length > MAX_INPUT_CHARS) {
    return res.status(400).json({
      error: `Input must be ${MAX_INPUT_CHARS.toLocaleString()} characters or fewer.`,
    });
  }

  const ip = String(req.headers["x-forwarded-for"] || "unknown")
    .split(",")[0]
    .trim();
  if (!checkRateLimit(ip)) {
    res.setHeader("Retry-After", "600");
    return res.status(429).json({
      error: "Too many requests. Please wait a few minutes and try again.",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not configured.");
    return res.status(503).json({
      error: "The AI service is temporarily unavailable. Please try again later.",
    });
  }

  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const requestBody = {
    systemInstruction: {
      parts: [{ text: featureConfig.systemInstruction }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userInput.trim() }],
      },
    ],
    generationConfig: {
      maxOutputTokens: featureConfig.maxOutputTokens,
      temperature: 0.2,
    },
  };

  try {
    const { response, data } = await callGemini(url, apiKey, requestBody);

    if (!response.ok) {
      console.error("Gemini request failed:", {
        status: response.status,
        upstreamStatus: data?.error?.status || "unknown",
      });

      if (response.status === 429) {
        res.setHeader("Retry-After", response.headers.get("retry-after") || "60");
        return res.status(429).json({
          error: "The AI service is busy or has reached its current quota. Please try again later.",
        });
      }

      return res.status(response.status >= 500 ? 503 : 502).json({
        error: "The AI service could not complete the request. Please try again.",
      });
    }

    const candidate = data?.candidates?.[0];
    const text = (candidate?.content?.parts || [])
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("")
      .trim();

    if (!text) {
      console.error(
        "Gemini returned no text:",
        JSON.stringify({
          finishReason: candidate?.finishReason,
          promptFeedback: data?.promptFeedback,
        }).slice(0, 300),
      );
      return res.status(502).json({
        error: "The AI service did not produce a response. Please try rephrasing your request.",
      });
    }

    return res.status(200).json({
      text,
      truncated: candidate?.finishReason === "MAX_TOKENS",
    });
  } catch (error) {
    const timedOut = error?.name === "AbortError";
    console.error("Gemini function error:", timedOut ? "request timed out" : error?.message);
    return res.status(503).json({
      error: timedOut
        ? "The AI service took too long to respond. Please try again."
        : "The AI service is temporarily unavailable. Please try again.",
    });
  }
};
