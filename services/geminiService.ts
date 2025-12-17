import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AnalysisTone } from "../types";

const apiKey = process.env.API_KEY;

// Initialize Gemini Client
// Note: In a real production app, you might want to proxy this through a backend
// to keep the key secure, but for this frontend demo, we use the env variable.
const ai = new GoogleGenAI({ apiKey: apiKey });

export const analyzeRejection = async (
  text: string, 
  tone: AnalysisTone
): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const modelId = "gemini-2.5-flash"; // Optimized for text analysis and speed

  // Prompt translated to Spanish to ensure output quality in the target language
  const prompt = `
    Actúa como un experto Analista Order-to-Cash (O2C) y Especialista en Facturación Electrónica familiarizado con GoSocket, GBS y estructuras XML.
    
    Tu tarea es analizar el siguiente log de rechazo o mensaje de error de factura electrónica:
    
    "${text}"
    
    Genera la respuesta EXCLUSIVAMENTE EN ESPAÑOL.
    
    Por favor, proporciona la salida en la siguiente estructura:
    1. **Resumen**: Una explicación simple del error, traduciendo la jerga técnica a términos funcionales de O2C.
    2. **Causa Raíz**: Identifica la fuente probable. ¿Es un error de datos en GBS? ¿Error de Maestro de Clientes? ¿XML mal formado? ¿Problema de configuración fiscal? ¿Falta un campo obligatorio (Account Code, UOM, Net Amount, Tax Code, etc.)?
    3. **Acciones**: Una lista de pasos concretos y recomendados para resolver esto. Especifica si se necesita soporte de IT o si el usuario debe corregir datos en GBS o el Maestro.
    4. **Comentario Profesional**: Un comentario listo para copiar para correo o ticket. El tono debe ser: ${tone}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "Explicación clara del error en términos funcionales O2C (en Español)."
            },
            rootCause: {
              type: Type.STRING,
              description: "La causa raíz identificada (GBS, Maestro, XML, etc.) (en Español)."
            },
            actions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de acciones correctivas paso a paso (en Español)."
            },
            professionalComment: {
              type: Type.STRING,
              description: "Texto de respuesta profesional redactado en el tono solicitado (en Español)."
            }
          },
          required: ["summary", "rootCause", "actions", "professionalComment"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("Empty response from AI");
    }

    const result = JSON.parse(jsonText) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze the rejection. Please try again.");
  }
};