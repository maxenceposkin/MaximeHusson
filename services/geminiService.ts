
import { GoogleGenAI } from "@google/genai";

// Safe access to API KEY to prevent crash if process is not defined
const getApiKey = () => {
  try {
    return (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();

export const generateArtistBio = async (keywords: string): Promise<string> => {
  if (!apiKey) {
    return "Photographe et réalisateur dont le travail explore la tension entre l'espace urbain et l'intimité du silence.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rédige une biographie d'artiste courte, élégante et énigmatique (maximum 100 mots) pour un photographe/réalisateur. Ton professionnel et poétique. Mots-clés : ${keywords}. Réponds uniquement en Français.`,
    });

    return response.text || "Erreur de génération.";
  } catch (error) {
    console.error("Error generating bio:", error);
    return "Photographe et réalisateur basé à Paris. Explore les frontières entre la lumière et l'obscurité.";
  }
};
