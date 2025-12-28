// scripts/test_tone.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// MOCKING THE API LOGIC LOCALLY TO TEST PROMPT GENERATION
// (Since we can't easily curl the Next.js API from here without it running and having env vars accessible easily in script context without setup)
// Actually, better to just use the actual 'model' from lib if possible, but lib uses alias @/.
// We will replicate the prompt logic here to test the PROMPT effectiveness.

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "YOUR_API_KEY_HERE"; // User might need to set this
// Wait, I can't access user's env easily. 

// ALTERNATIVE: Use fetch against the running local server?
// The user has 'npm run dev' running.
// I can use fetch('http://localhost:3000/api/ai/create-session') if node fetch is available.

async function testTone(style, mode) {
    console.log(`\n--- TESTING: ${style} + ${mode} ---`);
    try {
        const response = await fetch("http://localhost:3000/api/ai/create-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                role: "Software Engineer",
                level: "Mid-Level",
                type: "Technical",
                experience: 3,
                candidateName: "Tester",
                speakingStyle: style,
                interviewMode: mode,
                contextResume: ""
            })
        });
        const data = await response.json();
        console.log("RESPONSE:", data.question);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

async function run() {
    await testTone("Authoritative", "Strict Panel");
    // await testTone("Energetic", "Casual");
}

run();
