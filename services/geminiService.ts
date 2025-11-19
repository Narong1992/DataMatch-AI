import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysisResult } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeDataMismatch = async (left: string, right: string): Promise<GeminiAnalysisResult> => {
  try {
    const ai = getClient();
    
    // Clean inputs slightly to avoid token waste if empty, though UI handles empty checks
    const cleanLeft = left.trim();
    const cleanRight = right.trim();

    const prompt = `
      You are an expert data analyst. Compare the following two data inputs (labeled Source A and Source B).
      
      Source A:
      """
      ${cleanLeft}
      """

      Source B:
      """
      ${cleanRight}
      """

      Determine if they are semantically equivalent (meaning matches even if wording differs slightly) or if they are completely different.
      Identify key differences in data points, numbers, names, or logic.
      Return the response in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSemanticMatch: { type: Type.BOOLEAN, description: "True if the core meaning/data is effectively the same, ignoring minor formatting or case." },
            similarityScore: { type: Type.INTEGER, description: "A score from 0 to 100 indicating how similar they are." },
            summary: { type: Type.STRING, description: "A concise summary of the relationship between the two inputs." },
            keyDifferences: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "A list of specific differences found (e.g., 'Date mismatch: 2023 vs 2024', 'Missing key: ID')." 
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable suggestions to reconcile the data."
            }
          },
          required: ["isSemanticMatch", "similarityScore", "summary", "keyDifferences"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GeminiAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};