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
        // 2.1 Server-side Auth Validation
        await verifyAuth(req);

        const {
            role,
            level,
            type,
            experience,
            candidateName,
            speakingStyle,
            interviewMode,
            contextResume
        } = await req.json();

        console.log("CreateSession Payload:", { speakingStyle, interviewMode, role });

        const persona = PERSONA_DESCRIPTIONS[speakingStyle] || PERSONA_DESCRIPTIONS.Professional;
        const mode = MODE_DESCRIPTIONS[interviewMode] || MODE_DESCRIPTIONS.Standard;

        const systemPrompt = `
      You are an expert ${role} interviewer. 
      Target Candidate: ${candidateName}
      Experience Level: ${level} (${experience} years)
      Interview Type: ${type}
      
      *** CRITICAL PERSONA INSTRUCTIONS ***
      You MUST adopt the following persona and dynamics EXTREMELY:
      - PERSONA: ${persona}
      - DYNAMICS: ${mode}
      - DIFFICULTY LEVEL: ${LEVEL_DIFFICULTY[level] || LEVEL_DIFFICULTY["Mid-Level"]}
      
      CONTEXT:
      Candidate Resume/Bio: "${contextResume || "Not provided"}"
      
      TASK:
      Generate the FIRST interview question for this candidate. 
      It must establish the tone immediately and be DEEPLY RELEVANT to the explicit skills/experience in the resume or the specific role.
      The complexity MUST MATCH the difficulty level defined above.
      
      STYLE RULES:
      1. Opening: Provide a 1-sentence opening that SCREAMS your persona (e.g., Authoritative: "Let's not waste time.", Friendly: "Hey! So glad to chat!").
      2. Question: Ask a CHALLENGING, specific question. Do not ask generic "tell me about yourself" unless it's a specific angle.
      3. FORMATTING: STRICTLY PLAIN TEXT. NO MARKDOWN. NO ASTERISKS (**). NO BOLDING.
      4. Return ONLY the text.
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
        console.error("Create Session API Error:", error);
        return NextResponse.json({
            error: "Failed to generate question",
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
