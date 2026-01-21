
import { GoogleGenAI, Type } from "@google/genai";
import { FormEntry, FormField, AutofillSuggestion } from "../types";

/**
 * Limpia el string de respuesta para asegurar que solo contenga el JSON.
 * A veces el modelo devuelve bloques de código Markdown even con responseMimeType.
 */
const sanitizeJsonString = (str: string): string => {
  let clean = str.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
  }
  return clean;
};

export const getSmartAutofillSuggestions = async (
  currentFields: { name: string; label: string; type: string }[],
  history: FormEntry[]
): Promise<AutofillSuggestion[]> => {
  if (!history || history.length === 0) {
    console.warn("GeminiService: No hay historial para analizar.");
    return [];
  }

  // Usamos el modelo recomendado para tareas de texto básicas
  const modelName = 'gemini-3-flash-preview';
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construir una base de conocimiento compacta agrupando valores por concepto semántico
  const userProfile: Record<string, Set<string>> = {};
  history.forEach(entry => {
    entry.fields.forEach(f => {
      const key = (f.label || f.name).toLowerCase();
      if (!userProfile[key]) userProfile[key] = new Set();
      userProfile[key].add(f.value);
    });
  });

  // Convertir Sets a Arrays para el prompt
  const simplifiedProfile: Record<string, string[]> = {};
  for (const key in userProfile) {
    simplifiedProfile[key] = Array.from(userProfile[key]);
  }

  const prompt = `
Actúa como un asistente de autocompletado inteligente. 

HISTORIAL DEL USUARIO (Datos conocidos):
${JSON.stringify(simplifiedProfile, null, 2)}

CAMPOS DEL FORMULARIO ACTUAL:
${JSON.stringify(currentFields, null, 2)}

TAREA:
Relaciona los campos del formulario actual con los datos del historial. 
Incluso si las etiquetas no son idénticas (ej: "Nombre" vs "Full Name"), usa razonamiento semántico para encontrar la mejor coincidencia.

Devuelve un array JSON con objetos que contengan:
- fieldName: El nombre exacto del campo en el formulario actual.
- suggestedValue: El valor más apropiado del historial.
- confidence: Probabilidad de acierto (0.0 a 1.0).
- reason: Breve explicación del mapeo.

IMPORTANTE: Responde ÚNICAMENTE con el array JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: "Eres un experto en extracción de datos y mapeo semántico. Tu objetivo es ayudar a los usuarios a rellenar formularios basándote en su historial previo. Responde exclusivamente con un array JSON válido.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              fieldName: { type: Type.STRING },
              suggestedValue: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            },
            required: ["fieldName", "suggestedValue", "confidence"]
          }
        }
      }
    });

    const text = response.text;
    console.debug("Gemini raw response:", text);
    
    if (!text) return [];

    try {
      const cleanText = sanitizeJsonString(text);
      return JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Error parseando JSON de Gemini:", parseError, text);
      return [];
    }
  } catch (error: any) {
    console.error("Error en GeminiService:", error);
    
    // Capturar errores comunes de autenticación o cuotas en este entorno
    const errorMessage = error?.message || "";
    if (errorMessage.includes("Requested entity was not found") || 
        errorMessage.includes("API key not valid") ||
        errorMessage.includes("API_KEY_INVALID")) {
      throw new Error("AUTH_ERROR");
    }
    
    return [];
  }
};
