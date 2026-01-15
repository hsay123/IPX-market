import { google } from "@google-cloud/aiplatform"

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "us-central1"

export interface QueryAnalysis {
  intent: "search" | "discover" | "recommend" | "explore"
  entities: string[]
  keywords: string[]
  category?: string
  confidence: number
}

/**
 * Analyze user search query using Vertex AI NLP
 * Extracts intent, entities, and keywords from natural language
 */
export async function analyzeSearchQuery(query: string): Promise<QueryAnalysis> {
  try {
    if (!PROJECT_ID || !query.trim()) {
      return getDefaultQueryAnalysis(query)
    }

    console.log("[v0] Analyzing query with Vertex AI NLP:", query)

    const client = new google.cloud.aiplatform.v1.PredictionServiceClient({
      apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
    })

    const request = {
      endpoint: `projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/openapi`,
      instances: [
        {
          prompt_1: `Analyze this marketplace search query and provide NLP insights. Return ONLY valid JSON:
Query: "${query}"

Provide these exact fields:
{
  "intent": "search|discover|recommend|explore",
  "entities": ["entity1", "entity2"],
  "keywords": ["keyword1", "keyword2"],
  "category": "Computer Vision|NLP|Finance|Healthcare|Audio|Science|null",
  "confidence": 0.85
}

Intent definitions:
- search: User is looking for specific items
- discover: User wants to explore/browse
- recommend: User wants suggestions
- explore: User wants to learn about topics`,
        },
      ],
      parameters: {
        temperature: 0.3,
        max_output_tokens: 300,
      },
    }

    const [response] = await client.predict(request as any)
    const predictions = response.predictions || []

    if (predictions.length === 0) {
      return getDefaultQueryAnalysis(query)
    }

    try {
      const content = predictions[0].content?.toString() || "{}"
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : content
      const analysis = JSON.parse(jsonStr)

      console.log("[v0] Query analysis successful:", analysis)
      return analysis
    } catch {
      return getDefaultQueryAnalysis(query)
    }
  } catch (error) {
    console.error("[v0] NLP query analysis failed:", error)
    return getDefaultQueryAnalysis(query)
  }
}

/**
 * Calculate semantic similarity between two tag arrays
 * Used for recommendations and similar item discovery
 */
export function calculateSemanticSimilarity(tags1: string[], tags2: string[]): number {
  if (!tags1.length || !tags2.length) return 0

  const set1 = new Set(tags1.map((t) => t.toLowerCase()))
  const set2 = new Set(tags2.map((t) => t.toLowerCase()))

  const intersection = new Set([...set1].filter((x) => set2.has(x)))
  const union = new Set([...set1, ...set2])

  return union.size === 0 ? 0 : intersection.size / union.size
}

/**
 * Extract domain-specific keywords from tags
 */
export function extractDomainKeywords(tags: string[]): string[] {
  const domainKeywords: { [key: string]: string[] } = {
    vision: ["image", "vision", "detection", "segmentation", "classification", "cnn"],
    nlp: ["text", "language", "nlp", "embedding", "semantic", "bert", "transformer"],
    finance: ["finance", "stock", "trading", "price", "market", "financial"],
    healthcare: ["medical", "health", "diagnosis", "disease", "patient", "clinical"],
    audio: ["audio", "speech", "sound", "voice", "acoustic", "phonetic"],
    science: ["climate", "weather", "science", "physics", "chemistry", "biology"],
  }

  const foundDomains = new Set<string>()
  const lowerTags = tags.map((t) => t.toLowerCase())

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    if (keywords.some((kw) => lowerTags.some((tag) => tag.includes(kw)))) {
      foundDomains.add(domain)
    }
  }

  return Array.from(foundDomains)
}

function getDefaultQueryAnalysis(query: string): QueryAnalysis {
  const lowerQuery = query.toLowerCase()
  const categories = ["Computer Vision", "NLP", "Finance", "Healthcare", "Audio", "Science"]
  const detectedCategory = categories.find((cat) => lowerQuery.includes(cat.toLowerCase()))

  return {
    intent: "search",
    entities: [query],
    keywords: query.split(/\s+/).filter((w) => w.length > 3),
    category: detectedCategory,
    confidence: 0.5,
  }
}
