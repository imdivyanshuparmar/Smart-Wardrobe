import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, ClothingItem, RecommendationResponse } from "../types";

export const getOutfitRecommendation = async (
  profile: UserProfile,
  items: ClothingItem[]
): Promise<RecommendationResponse> => {

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imageParts = items.map(item => ({
    inlineData: {
      mimeType: "image/png",
      data: item.image.split(',')[1],
    }
  }));

  const prompt = `
You are an expert AI Fashion Stylist specialized in styling college students and young professionals.

IMPORTANT:
You must strictly apply professional color theory and rule-based outfit logic.
Do NOT randomly combine items. Follow the rules below carefully.

-----------------------------------
USER PROFILE
-----------------------------------
Name: ${profile.name}
Skin Tone: ${profile.skinTone}
Height: ${profile.height} cm
Body Frame: ${profile.bodyFrame}

-----------------------------------
RULE-BASED COLOR LOGIC
-----------------------------------

1. SKIN TONE BASED COLOR SELECTION:

If Skin Tone is Fair:
- Best Colors: Navy, Emerald, Burgundy, Pastel Blue, Soft Pink, Charcoal
- Avoid: Extremely pale beige or washed-out yellow

If Skin Tone is Medium/Wheatish:
- Best Colors: Olive, Mustard, Teal, Maroon, Rust, Royal Blue
- Avoid: Colors too close to skin tone (muddy browns)

If Skin Tone is Dark:
- Best Colors: Bright White, Cobalt Blue, Red, Orange, Fuchsia, Lavender
- Avoid: Very dull greys or faded browns

-----------------------------------
2. TOP & BOTTOM COLOR FAMILY MATCHING RULES:

Use professional color harmony principles:

NEUTRAL TOP (White, Black, Grey, Beige)
→ Can pair with ANY solid bottom color.

DARK TOP (Navy, Maroon, Dark Green, Black)
→ Pair with Light Bottom (Light Blue, Beige, White, Grey).

LIGHT TOP (Pastel, Light Blue, Pink, Cream)
→ Pair with Dark Bottom (Black, Navy, Dark Brown).

BRIGHT TOP (Red, Yellow, Orange)
→ Pair with Neutral Bottom (Black, White, Denim Blue).

MONOCHROME RULE:
→ Same color family but different shade (e.g., Light Blue + Navy).

CONTRAST RULE:
→ Use complementary colors (Blue + Beige, Maroon + Grey, Olive + Cream).

-----------------------------------
3. BODY FRAME STYLING RULES:

If Slim:
- Add layering
- Horizontal elements acceptable

If Broad/Heavy:
- Prefer darker bottoms
- Vertical patterns
- Structured fits

If Average:
- Balanced proportions
- Avoid too oversized fits

-----------------------------------
4. HEIGHT RULES:

Short:
- Avoid heavy color breaks
- Prefer monochrome styling

Tall:
- Can experiment with contrast
- Layering works well

-----------------------------------
TASK:

1. Analyze all provided clothing items.
2. Identify top and bottom pieces.
3. Apply color family logic.
4. Apply skin tone compatibility.
5. Apply height + body frame logic.
6. Choose the BEST professional combination.
7. Explain WHY scientifically and stylistically.

IMPORTANT:
- If a color combination breaks the above rules, DO NOT recommend it.
- Be logical and structured.
- Confidence score must reflect rule strength.

Return STRICT JSON only.

`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        ...imageParts,
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          outfitName: { type: Type.STRING },
          description: { type: Type.STRING },
          styleTips: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          colorPalette: { 
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Hex color codes representing the suggested palette"
          },
          confidenceScore: { 
            type: Type.NUMBER,
            description: "A score from 0 to 100 based on rule compliance"
          },
          occasionSuitability: { type: Type.STRING }
        },
        required: [
          "outfitName",
          "description",
          "styleTips",
          "colorPalette",
          "confidenceScore",
          "occasionSuitability"
        ]
      }
    }
  });

  const responseText = response.text || "";

  try {
    return JSON.parse(responseText.trim());
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Could not generate recommendation");
  }
};
