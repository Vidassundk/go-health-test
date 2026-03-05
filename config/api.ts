export const QUIZ_API_URL_ERROR_MESSAGE =
  "EXPO_PUBLIC_QUIZ_API_URL is not set. Add it to your .env file.";

export function isQuizApiConfigured(): boolean {
  return !!process.env.EXPO_PUBLIC_QUIZ_API_URL;
}

export function getQuizApiUrl(): string {
  const url = process.env.EXPO_PUBLIC_QUIZ_API_URL;
  if (!url) {
    throw new Error(QUIZ_API_URL_ERROR_MESSAGE);
  }
  return url;
}
