/**
 * config.js – loads IBM Cloud credentials into process.env
 * Works alongside dotenv: values here are only applied when
 * the env var is not already set (e.g. from a real .env file).
 */

function setIfMissing(key, value) {
  if (!process.env[key]) process.env[key] = value;
}

setIfMissing('IBM_API_KEY',       'MSRATqEUgVVg4ZlXChwTnB6XXYSR4b1KmbKgguW-jVph');
setIfMissing('IBM_PROJECT_ID',    'b764144e-ada9-4eda-ae4b-9be3543dd609');
setIfMissing('IBM_WML_URL',       'https://us-south.ml.cloud.ibm.com');
setIfMissing('IBM_IAM_URL',       'https://iam.cloud.ibm.com/identity/token');
setIfMissing('IBM_GRANITE_MODEL', 'ibm/granite-4-h-small');
setIfMissing('MAX_NEW_TOKENS',    '800');
setIfMissing('TEMPERATURE',       '0.7');
setIfMissing('TOP_P',             '0.9');
setIfMissing('PORT',              '3000');
setIfMissing('NODE_ENV',          'development');
setIfMissing('RATE_LIMIT_WINDOW_MS',      '900000');
setIfMissing('RATE_LIMIT_MAX_REQUESTS',   '100');
