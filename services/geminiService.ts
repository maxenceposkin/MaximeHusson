import { GoogleGenAI } from "@google/genai";

export const generateArtistBio = async (keywords: string): Promise<string> => {
  try {
    // Initialization must use process.env.API_KEY directly as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rédige une biographie d'artiste courte, élégante et énigmatique (maximum 100 mots) pour un photographe/réalisateur. Utilise un ton professionnel mais poétique, similaire aux portfolios d'art contemporain. Utilise ces mots-clés comme inspiration : ${keywords}. Réponds uniquement en Français.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
      }
    });

    return response.text || "Impossible de générer la description.";
  } catch (error) {
    console.error("Error generating bio:", error);
    return "Une erreur est survenue lors de la génération de la biographie.";
  }
};