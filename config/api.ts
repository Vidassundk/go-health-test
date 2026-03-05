function requireQuizApiUrl(): string {
  const url = process.env.EXPO_PUBLIC_QUIZ_API_URL;
  if (!url) {
    throw new Error(
      "EXPO_PUBLIC_QUIZ_API_URL is not set. Add it to your .env file."
    );
  }
  return url;
}

export const quizApiConfig = {
  baseUrl: requireQuizApiUrl(),
} as const;
