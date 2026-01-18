
import { GoogleGenAI, Type } from "@google/genai";
import { FormEntry, FormField, AutofillSuggestion } from "../types";

export const getSmartAutofillSuggestions = async (
  currentFields: { name: string; label: string; type: string }[],
  history: FormEntry[]
): Promise<AutofillSuggestion[]> => {
  // Always initialize GoogleGenAI inside the function call to ensure it uses current environment variables
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Extract all unique previously saved key-value pairs to build a knowledge base
  const knowledgeBase: Record<string, string[]> = {};
  history.forEach(entry => {
    entry.fields.forEach(field => {
      if (!knowledgeBase[field.label]) knowledgeBase[field.label] = [];
      if (!knowledgeBase[field.label].includes(field.value)) {
        knowledgeBase[field.label].push(field.value);
      }
      
      const nameKey = `field_name:${field.name}`;
      if (!knowledgeBase[nameKey]) knowledgeBase[nameKey] = [];
      if (!knowledgeBase[nameKey].includes(field.value)) {
        knowledgeBase[nameKey].push(field.value);
      }
    });
  });

  const prompt = `
    I have a web form with the following fields:
    ${JSON.stringify(currentFields, null, 2)}

    I have a database of previously filled form data (knowledge base):
    ${JSON.stringify(knowledgeBase, null, 2)}

    Analyze the current fields and the knowledge base. Suggest the most likely values for each current field.
    Note that field names might vary (e.g., 'fname' vs 'first_name' vs 'Name'). 
    Use your intelligence to map semantically similar fields.
    Return only valid JSON matching the specified schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              fieldName: { type: Type.STRING, description: "The 'name' attribute of the current form field" },
              suggestedValue: { type: Type.STRING, description: "The most likely value from history" },
              confidence: { type: Type.NUMBER, description: "Confidence score 0-1" },
              reason: { type: Type.STRING, description: "Why this value was chosen" }
            },
            required: ["fieldName", "suggestedValue", "confidence"]
          }
        }
      }
    });

    // Access the .text property directly (do not call as a function)
    const jsonStr = response.text;
    return JSON.parse(jsonStr || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
