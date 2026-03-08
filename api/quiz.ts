import { getQuizApiUrl } from "@/config/api";
import { locale } from "@/constants/locale";
import type { QuizApiResponse } from "@/types/quiz";

export async function fetchQuizQuestions(): Promise<QuizApiResponse["data"]> {
  let response: Response;
  try {
    response = await fetch(getQuizApiUrl());
  } catch {
    throw new Error(locale.apiErrors.quizApiNetwork);
  }

  if (!response.ok) {
    throw new Error(locale.apiErrors.quizApiRequestFailed);
  }

  const json: QuizApiResponse = await response.json();

  if (!json?.data?.questions) {
    throw new Error(locale.apiErrors.quizApiInvalidResponse);
  }

  return json.data;
}
