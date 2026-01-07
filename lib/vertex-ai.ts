import { google } from "@google-cloud/aiplatform"

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "us-central1"

export interface ImageAnalysisResult {
  cinemaStory: string
  improvedCaption: string
  semanticTags: string[]
  confidence: number
}

/**
 * Analyze image using Google Vertex AI Vision API
 * Returns cinematic story, improved caption, and semantic tags
 */
export async function analyzeImageWithVertexAI(imageUrl: string): Promise<ImageAnalysisResult> {
  try {
    if (!PROJECT_ID) {
      console.warn("[v0] GOOGLE_CLOUD_PROJECT_ID not set, skipping Vertex AI analysis")
      return getDefaultAnalysisResult()
    }

    console.log("[v0] Starting Vertex AI image analysis for:", imageUrl)

    const client = new google.cloud.aiplatform.v1.PredictionServiceClient({
      apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
    })

    const request = {
      endpoint: `projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/openapi`,
      instances: [
        {
          prompt_1: `You are a creative storyteller and image analyst. Analyze this image URL: ${imageUrl}
          
Provide ONLY valid JSON with these exact fields (no markdown, no code blocks, just JSON):
{
  "cinemaStory": "A cinematic 3-5 line narrative describing the image as if it were a film scene",
  "improvedCaption": "A concise, professional image caption (max 20 words)",
  "semanticTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "confidence": 0.85
}`,
        },
      ],
      parameters: {
        temperature: 0.7,
        max_output_tokens: 500,
      },
    }

    const [response] = await client.predict(request as any)

    const predictions = response.predictions || []
    if (predictions.length === 0) {
      console.warn("[v0] No predictions from Vertex AI, using defaults")
      return getDefaultAnalysisResult()
    }

    const prediction = predictions[0]
    let analysisData: ImageAnalysisResult

    try {
      // Extract JSON from response content
      const content = prediction.content?.toString() || "{}"
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : content

      analysisData = JSON.parse(jsonStr)

      if (!analysisData.cinemaStory || !analysisData.improvedCaption || !Array.isArray(analysisData.semanticTags)) {
        throw new Error("Invalid response structure")
      }

      console.log("[v0] Vertex AI analysis successful:", analysisData)
      return analysisData
    } catch (parseError) {
      console.error("[v0] Failed to parse Vertex AI response:", parseError)
      return getDefaultAnalysisResult()
    }
  } catch (error) {
    console.error("[v0] Vertex AI analysis failed:", error)
    return getDefaultAnalysisResult()
  }
}

/**
 * Default analysis result when Vertex AI is unavailable
 */
function getDefaultAnalysisResult(): ImageAnalysisResult {
  return {
    cinemaStory: "A mysterious image waiting to be explored. This visual composition tells a unique story.",
    improvedCaption: "Visual content rich with potential and intrigue.",
    semanticTags: ["image", "visual", "content", "data", "dataset"],
    confidence: 0,
  }
}
