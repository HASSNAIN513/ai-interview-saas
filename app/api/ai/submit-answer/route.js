import { NextResponse } from "next/server";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { verifyAuth } from "@/lib/admin-auth";

const PERSONA_DESCRIPTIONS = {
  Professional: "seasoned executive recruiter. TONE: STRICTLY PROFESSIONAL. Feedback should be objective, structured, and distant. No fluff.",
  Authoritative: "high-pressure hiring manager. TONE: CRITICAL AND BLUNT. Focus on what was missing. Be hard to impress. Give lower scores for average answers.",
  Friendly: "warm peer interviewer. TONE: ENCOURAGING AND KIND. Highlight strengths. Use gentle language for corrections. Be generous with scores.",
  Energetic: "startup founder. TONE: HYPE AND PASSION. Focus on potential and energy. Use exclamation marks. Be excited about good ideas."
};

export async function POST(req) {
  try {
    await verifyAuth(req);
    const {
      question,
      answer,
      role,
      level,
      candidateName,
      speakingStyle,
      interviewMode
    } = await req.json();

    const persona = PERSONA_DESCRIPTIONS[speakingStyle] || PERSONA_DESCRIPTIONS.Professional;

    const systemPrompt = `
      You are an expert ${role} interviewer. 
      Candidate: ${candidateName}
      Question: "${question}"
      Candidate Answer: "${answer}"
      
      *** CRITICAL PERSONA INSTRUCTIONS ***
      You MUST adopt the following persona EXTREMELY in your feedback:
      - PERSONA: ${persona}
      - DYNAMICS: ${interviewMode} (If 'Strict Panel', deduct points heavily for vagueness. If 'Casual', focus on vibe.)
      
      TASK:
      Rate this answer on a scale of 1-100 based on accuracy, depth, and relevance for a ${level} position.
      - **Score Calibration**: 
          - Strict Panel / Authoritative: A standard answer is a 60. A good answer is 80.
          - Casual / Friendly: A standard answer is 80.
      
      STRICT FIRESTORE SAFETY RULES:
      1. Never return undefined values.
      2. If a value does not exist, return null.
      3. No functions, Date objects, or Symbols.
      4. Output must be valid JSON.
      
      Return JSON format:
      {
        "score": number,
        "feedback": "string (The tone MUST match the persona description above. Be distinctive.)"
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        }
      ],
      model: GROQ_MODEL,
      response_format: { type: "json_object" } // Force JSON mode
    });

    const text = chatCompletion.choices[0]?.message?.content;

    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const evaluation = JSON.parse(cleanText);

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("AI Evaluation Error:", error);
    return NextResponse.json({ error: "Failed to evaluate answer" }, { status: 500 });
  }
}
