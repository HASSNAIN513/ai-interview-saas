/**
 * Environment Variable Validation Script
 * This script ensures all required environment variables are set before the build starts.
 */

const REQUIRED_ENV_VARS = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'GROQ_API_KEY'
];

const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', 'ERROR: Missing required environment variables:');
    missing.forEach(key => console.error('\x1b[31m%s\x1b[0m', ` - ${key}`));
    console.error('\x1b[33m%s\x1b[0m', 'Please add them to your .env file or Vercel environment variables.');
    process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', '✓ Environment variables validated.');
process.exit(0);
