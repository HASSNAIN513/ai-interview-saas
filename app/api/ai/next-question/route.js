import { NextResponse } from "next/server";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { verifyAuth } from "@/lib/admin-auth";

const PERSONA_DESCRIPTIONS = {
    Professional: "seasoned executive recruiter. TONE: STRICTLY PROFESSIONAL, FORMAL, AND OBJECTIVE. Do not use casual language. Focus purely on competence and qualifications. Be polite but distant.",
    Authoritative: "high-pressure hiring manager from a top-tier firm. TONE: INTIMIDATING, BLUNT, AND DEMANDING. Challenge the candidate. Do not sugarcoat anything. Expect precision. Be skeptical.",
    Friendly: "warm and supportive team lead. TONE: CASUAL, ENCOURAGING, AND EMPATHETIC. Use colloquialisms. Make the candidate feel relaxed. Act like a friend helping them prepare.",
    Energetic: "passionate startup founder. TONE: HIGH-ENERGY, EXCITING, AND FAST-PACED. Use exclamation marks! Be hyped about the potential! Focus on passion and drive!"
};

const MODE_DESCRIPTIONS = {
    Standard: "Standard Interview: Ask a balanced mix of technical and behavioral questions. Assess overall fit.",
    "Strict Panel": "STRICT TECHNICAL GRILLING: Ask extremely difficult, edge-case technical questions. Drill down into implementation details. Do not accept high-level answers. Expose knowledge gaps.",
    Casual: "Coffee Chat: Focus on culture fit, soft skills, and high-level project experiences. Keep it conversational and low-stakes."
};

const LEVEL_DIFFICULTY = {
    "Entry-Level": "BASIC/ENTRY: Focus on core concepts, definitions, and simple implementation tasks. No system design. Hand-holding allowed.",
    "Mid-Level": "INTERMEDIATE: Focus on trade-offs, standard architectural patterns, and debugging complex scenarios. Expect independence.",
    "Senior": "ADVANCED: Focus on system design, scalability, hard technical constraints, and leadership scenarios. Expect high-level abstraction.",
    "Expert": "EXPERT/LEAD: Focus on organizational strategy, multi-system architecture, and resolving high-stakes technical conflicts. Challenge assumptions."
};

export async function POST(req) {
    try {
        await verifyAuth(req);
        const {
            role,
            level,
            previousQuestions,
            candidateName,
            speakingStyle,
            interviewMode,
            contextResume
        } = await req.json();

        console.log("NextQuestion Payload:", { speakingStyle, interviewMode });

        const persona = PERSONA_DESCRIPTIONS[speakingStyle] || PERSONA_DESCRIPTIONS.Professional;
        const mode = MODE_DESCRIPTIONS[interviewMode] || MODE_DESCRIPTIONS.Standard;

        const systemPrompt = `
      You are an expert ${role} interviewer. 
      Target Candidate: ${candidateName}
      Experience Level: ${level}
      Difficulty Constraint: ${LEVEL_DIFFICULTY[level] || LEVEL_DIFFICULTY["Mid-Level"]}
      Interview Type: ${interviewMode}
      
      CONTEXT:
      Resume/Bio: "${contextResume || "Not provided"}"
      
      Previous Interaction:
      ${previousQuestions.map((q, i) => `Q${i + 1}: ${q}`).join("\n")}
      
      TASK:
      1. Never return undefined values.
      2. If a value does not exist, return null. 
      3. No functions, Date objects, or Symbols.
      4. Return ONLY the text of the question, no JSON, no markdown.

      STYLE RULES:
      1. Transition: Start with a 1-sentence feedback/transition that is HEAVILY PERSONA-DRIVEN (e.g. Authoritative: "Your urgency is lacking.", Energetic: "That creates so many possibilities!").
      2. Question: The question complexity MUST match the DIFFICULTY LEVEL. (e.g. Junior = Basics, Lead = Architecture).
      3. Return ONLY the text string.
    `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                }
            ],
            model: GROQ_MODEL,
        });

        const question = chatCompletion.choices[0]?.message?.content || "Could not generate question.";

        return NextResponse.json({ question });
    } catch (error) {
        console.error("AI Next Question Error:", error);
        return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
    }
}
