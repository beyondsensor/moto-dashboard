export const maxDuration = 30

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error(
      "CRITICAL: OPENROUTER_API_KEY is missing from environment variables."
    )
    return new Response(JSON.stringify({ error: "API Key not configured" }), {
      status: 500,
    })
  }

  const { messages, siteContext } = await req.json()

  const systemPrompt = `You are "Ask Beyond", a professional security operations assistant for the Moto-Dashboard Unified Security Command Center.
Your tone is ultra-professional, efficient, and precise. 
You have access to real-time site data via the provided context.

FORMATTING GUIDELINES:
1. Use Markdown for clarity.
2. Use bold text for critical status or alerts.
3. Use Markdown tables for lists of cameras, sensors, or events.
4. Keep responses concise but information-dense.

OPERATIONAL GUIDELINES:
1. If the user asks about the site status, refer to the SITE CONTEXT provided below.
2. If there are offline cameras or critical alerts, prioritize mentioning them.
3. You can suggest "Operations Actions" like "Locking Sector 4" or "Checking CCTV feed at the Main Gate".

SITE CONTEXT:
${siteContext || "No live data available."}

Current Time: ${new Date().toLocaleString()}
`

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://moto-dashboard.dev",
        "X-Title": "Moto-Dashboard",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        stream: true,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error("OpenRouter API Error:", errorText)
    return new Response(
      JSON.stringify({ error: "Failed to connect to AI provider" }),
      { status: response.status }
    )
  }

  let buffer = ""
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      const decoder = new TextDecoder()
      buffer += decoder.decode(chunk, { stream: true })

      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        if (line.startsWith("data: ") && line.trim() !== "data: [DONE]") {
          try {
            const data = JSON.parse(line.slice(6))
            const content = data.choices[0]?.delta?.content
            if (content) {
              controller.enqueue(new TextEncoder().encode(content))
            }
          } catch (e) {
            // Ignore incomplete chunks
          }
        }
      }
    },
  })

  return new Response(response.body?.pipeThrough(transformStream), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
