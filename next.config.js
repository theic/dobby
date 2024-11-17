/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    LANGCHAIN_API_KEY: process.env.LANGCHAIN_API_KEY,
    LANGGRAPH_API_URL: process.env.LANGGRAPH_API_URL,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  },
};

module.exports = nextConfig;
