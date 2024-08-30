import dotenv from 'dotenv';
dotenv.config();
export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost',
  port: parseInt(process.env.PORT as string) || 3000,
  geminiApiKey: process.env.GEMINI_API_KEY,
};
