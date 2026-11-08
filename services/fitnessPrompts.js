/**
 * Fitness Buddy prompt engineering.
 * Builds OpenAI-compatible messages arrays for IBM Granite chat API.
 */

const SYSTEM_PROMPT = `You are Fitness Buddy, a friendly, knowledgeable, and motivating AI health and fitness coach.
Your role is to help users with:
- Personalized home workout routines and exercise recommendations
- Nutritious meal ideas and basic nutrition guidance
- Daily fitness motivation and habit-building tips
- Healthy lifestyle advice tailored to individual needs

Guidelines:
- Be warm, encouraging, and supportive in all responses
- Provide practical, actionable advice that can be done at home
- Ask clarifying questions when needed (fitness level, goals, equipment, dietary restrictions)
- Keep responses focused, structured, and easy to follow using bullet points or numbered steps
- Add motivational encouragement at the end of workout or meal suggestions
- Never provide medical diagnoses or replace professional medical advice
- If a user mentions injury or medical condition, recommend consulting a doctor first`;

/**
 * Detects the intent/category of the user message to add a context hint.
 */
function detectIntent(message) {
  const m = message.toLowerCase();
  if (/workout|exercise|training|cardio|strength|yoga|stretch|hiit|abs|arms|legs|chest|back|pushup|squat|run/i.test(m)) return 'workout';
  if (/eat|meal|food|diet|nutrition|calorie|protein|recipe|breakfast|lunch|dinner|snack|weight loss|gain|vegan|vegetarian/i.test(m)) return 'nutrition';
  if (/motivat|inspir|lazy|tired|unmotivated|give up|quit|encourage|boost|energy|help me start/i.test(m)) return 'motivation';
  if (/habit|routine|schedule|plan|goal|consistency|consistent|daily|track|discipline/i.test(m)) return 'habit';
  return 'general';
}

const INTENT_HINTS = {
  workout:    'The user is asking about workouts or exercises. Provide a structured routine with sets/reps where relevant.',
  nutrition:  'The user is asking about food or nutrition. Suggest healthy, practical meal ideas with nutritional benefits.',
  motivation: 'The user needs motivation. Be especially uplifting, empathetic, and energising.',
  habit:      'The user wants to build fitness habits. Provide concrete, actionable habit-building strategies.',
  general:    'Respond helpfully as a fitness and wellness coach.',
};

/**
 * Build the messages array for the IBM Granite chat API.
 *
 * @param {Array<{role:'user'|'assistant', content:string}>} history
 * @param {string} userMsg – the latest user message
 * @returns {Array<{role:string, content:string}>}
 */
function buildMessages(history, userMsg) {
  const intent = detectIntent(userMsg);
  const systemContent = `${SYSTEM_PROMPT}\n\nInstruction: ${INTENT_HINTS[intent]}`;

  const messages = [{ role: 'system', content: systemContent }];

  // Include last 6 exchanges for context
  const recent = history.slice(-6);
  for (const msg of recent) {
    messages.push({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: msg.content });
  }

  messages.push({ role: 'user', content: userMsg });
  return messages;
}

/**
 * Build messages for the welcome message (no history).
 */
function buildWelcomeMessages() {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content:
        'Introduce yourself briefly in 2-3 sentences and ask the user one question about their fitness goals to get started. Be warm, friendly, and energetic.',
    },
  ];
}

module.exports = { buildMessages, buildWelcomeMessages, detectIntent };
