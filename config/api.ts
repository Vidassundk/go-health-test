import { locale } from "@/constants/locale";

export const QUIZ_API_URL_ERROR_MESSAGE = locale.apiErrors.quizApiNotConfigured;

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
