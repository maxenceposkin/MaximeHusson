import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client
// Note: In a real production app, ensure API_KEY is handled securely (e.g., backend proxy).
const ai = new GoogleGenAI({ apiKey });

export const generateArtistBio = async (keywords: string): Promise<string> => {
  if (!apiKey) {
    return "Veuillez configurer votre clé API pour générer une biographie.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rédige une biographie d'artiste courte, élégante et énigmatique (maximum 100 mots) pour un photographe/réalisateur. Utilise un ton professionnel mais poétique, similaire aux portfolios d'art contemporain. Utilise ces mots-clés comme inspiration : ${keywords}. Réponds uniquement en Français.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for faster bio generation
      }
    });

    return response.text || "Impossible de générer la description.";
  } catch (error) {
    console.error("Error generating bio:", error);
    return "Une erreur est survenue lors de la génération de la biographie.";
  }
};
