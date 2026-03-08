import { getQuizApiUrl } from "@/config/api";
import type { QuizApiResponse } from "@/types/quiz";

const QUIZ_API_NETWORK_ERROR_MESSAGE =
  "Unable to reach Quiz API. Check your internet connection and try again.";

export async function fetchQuizQuestions(): Promise<QuizApiResponse["data"]> {
  let response: Response;
  try {
    response = await fetch(getQuizApiUrl());
  } catch {
    throw new Error(QUIZ_API_NETWORK_ERROR_MESSAGE);
  }

  if (!response.ok) {
    throw new Error(
      `Quiz API request failed: ${response.status} ${response.statusText}`
    );
  }

  const json: QuizApiResponse = await response.json();

  if (!json?.data?.questions) {
    throw new Error("Invalid quiz API response: missing data.questions");
  }

  return json.data;
}
