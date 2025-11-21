import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateSummary = async (content: string): Promise<string> => {
  if (!ai) return "AI Service Unavailable (Missing Key)";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following blog post content in 2 sentences, engaging and punchy:\n\n${content.substring(0, 5000)}`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Could not generate summary.";
  }
};

export const suggestTitle = async (content: string): Promise<string> => {
  if (!ai) return "";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Suggest a catchy, modern blog post title (no quotes) based on this content:\n\n${content.substring(0, 2000)}`,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Title Error:", error);
    return "";
  }
};

export const improveContent = async (content: string): Promise<string> => {
  if (!ai) return content;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Act as a professional editor. Improve the grammar and flow of the following text. Keep the markdown formatting intact. Do not add conversational filler:\n\n${content}`,
    });
    return response.text || content;
  } catch (error) {
    console.error("Gemini Improve Error:", error);
    return content;
  }
};