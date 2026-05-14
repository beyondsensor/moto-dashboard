"use server"

import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"
import { createStreamableValue } from "ai/rsc"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  compatibility: "compatible",
})

export async function beyondChatAction(messages: any[], siteContext: string) {
  const stream = createStreamableValue("")

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured")
  }

  ;(async () => {
    const { textStream } = await streamText({
      model: openrouter("google/gemini-2.0-flash-001"),
      system: `You are "Ask Beyond", a professional security operations assistant for the Moto-Dashboard Unified Security Command Center.
      Your tone is ultra-professional, efficient, and precise. 
      You have access to real-time site data via the provided context.
      
      SITE CONTEXT:
      ${siteContext || "No live data available."}
      
      Current Time: ${new Date().toLocaleString()}
      `,
      messages,
    })

    for await (const text of textStream) {
      stream.update(text)
    }

    stream.done()
  })()

  return { output: stream.value }
}
