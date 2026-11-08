/**
 * IBM Granite service – uses watsonx.ai Chat Completions API
 * Endpoint: POST /ml/v1/text/chat
 * Model:    ibm/granite-4-h-small  (available on Lite tier)
 */
const axios = require('axios');

let cachedToken = null;
let tokenExpiry  = 0;

/**
 * Fetch (or return cached) IBM Cloud IAM bearer token.
 */
async function getIAMToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const response = await axios.post(
    process.env.IBM_IAM_URL || 'https://iam.cloud.ibm.com/identity/token',
    new URLSearchParams({
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      apikey: process.env.IBM_API_KEY,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  cachedToken = response.data.access_token;
  // Expire 5 minutes before the real expiry to be safe
  tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
  return cachedToken;
}

/**
 * Call IBM Granite via watsonx.ai Chat Completions endpoint.
 *
 * @param {Array<{role:string, content:string}>} messages
 * @returns {string} – the model's reply text
 */
async function generateWithGranite(messages) {
  const token     = await getIAMToken();
  const modelId   = process.env.IBM_GRANITE_MODEL || 'ibm/granite-4-h-small';
  const projectId = process.env.IBM_PROJECT_ID;
  const wmlUrl    = process.env.IBM_WML_URL || 'https://us-south.ml.cloud.ibm.com';

  const payload = {
    model_id:   modelId,
    project_id: projectId,
    messages,
    parameters: {
      max_tokens:  parseInt(process.env.MAX_NEW_TOKENS) || 800,
      temperature: parseFloat(process.env.TEMPERATURE)  || 0.7,
      top_p:       parseFloat(process.env.TOP_P)        || 0.9,
    },
  };

  const response = await axios.post(
    `${wmlUrl}/ml/v1/text/chat?version=2023-05-29`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  const text = response.data?.choices?.[0]?.message?.content || '';
  return text.trim();
}

module.exports = { generateWithGranite };
