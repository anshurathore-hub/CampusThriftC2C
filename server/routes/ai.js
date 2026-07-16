import express from "express";
import { GoogleGenAI } from "@google/genai";
import upload from "../middleware/upload.js";

const router = express.Router();
const MODEL = "gemini-2.5-flash";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/generate-description", async (req, res) => {
  try {
    const { title, category, condition } = req.body;

    const prompt = `
You are helping an Indian college student sell a used item on CampusThrift.

Item:
Title: ${title}
Category: ${category}
Condition: ${condition}

Write like a real student, NOT a company.

Rules:
- 30–60 words
- Natural Indian English with a little Hinglish
- Casual and friendly
- Mention the condition honestly
- Don't sound like Flipkart or Amazon
- Don't invent features
- Don't mention "best quality" or marketing words
- No emojis
- No quotation marks

Examples of tone:

"Bought last semester but ab use nahi aa raha. Everything works properly and condition is good. Can be useful for another student."

"Good condition. Hardly used because I switched to a laptop. Pickup from Amity Noida preferred."

"Used for one semester only. Sab kuch properly work karta hai. Selling because I don't need it anymore."
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    res.json({
      description: response.text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "AI generation failed",
    });
  }
});

router.post("/suggest-price", async (req, res) => {
  try {
    const { title, category, condition } = req.body;

    const prompt = `
You are pricing used products for Indian university students.

Think about:

• Typical resale prices
• Student budgets
• Item condition
• Fair market value

Item

Title:
${title}

Category:
${category}

Condition:
${condition}

Return ONLY JSON.

{
"minimumPrice":0,
"maximumPrice":0,
"recommendedPrice":0,
"reason":""
}

Rules

Engineering books:
₹200-800

Calculators:
₹400-1200

Laptops:
₹15000-70000

Lab coats:
₹150-600

Headphones:
₹500-5000

Sports equipment:
Depends on condition

Never suggest unrealistic prices.

Reason should be under 15 words.
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    let text = response.text.trim();

    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");

    const result = JSON.parse(text);

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Price suggestion failed",
    });
  }
});

router.post("/analyze-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const imageBase64 = req.file.buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: MODEL,

      contents: [
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: imageBase64,
          },
        },

        {
          text: `
You are analyzing a product image for a university marketplace.

Return ONLY valid JSON.

{
"title":"",
"category":"",
"condition":""
}

Rules:

Category must be exactly one of:

Electronics
Books
Stationery
Clothes
Tickets
Sports
Others

Condition must be exactly one of:

Like New
Excellent
Good
Fair
Poor

Title should be short and natural.

Do not return markdown.

Do not explain anything.

Return JSON only.
`,
        },
      ],
    });

    let text = response.text.trim();

    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");

    const result = JSON.parse(text);

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "AI image analysis failed",
    });
  }
});

export default router;
