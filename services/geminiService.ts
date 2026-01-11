import { GoogleGenAI } from "@google/genai";
import { Scene, TimelineItem } from "../types";

// Helper to get client with current key
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const generateSceneDescription = async (scene: Scene): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `Describe a cinematic night drive scene. 
    Route: ${scene.route}. 
    Vibe: ${scene.vibe}. 
    Weather: ${scene.weather}. 
    Keep it evocative, visual, and under 50 words. Focus on lighting and atmosphere.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "A dark, mysterious road stretches ahead...";
  } catch (error) {
    console.error("GenAI Text Error:", error);
    return "Failed to generate description. Please check API key.";
  }
};

export const generateVeoVideo = async (scene: Scene, timeline: TimelineItem[]): Promise<string> => {
  // Check for API Key selection for Veo
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        throw new Error("Please select a paid API key to use Veo.");
      }
  }

  const ai = getClient();
  
  // Construct a rich prompt from scene + timeline
  const momentsText = timeline.map(t => t.description).join(", then ");
  const prompt = `Cinematic video, photorealistic, 4k. 
  A night drive. ${scene.description}. 
  Sequence of events: ${momentsText}.
  Style: ${scene.vibe} aesthetic, high contrast, cinematic lighting.`;

  console.log("Generating Veo with prompt:", prompt);

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: '16:9'
    }
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("No video URI returned.");
  
  // Append key for fetching
  return `${videoUri}&key=${process.env.API_KEY}`;
};
