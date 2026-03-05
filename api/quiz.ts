import { quizApiConfig } from "@/config/api";
import type { QuizApiResponse } from "@/types/quiz";

export class QuizApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "QuizApiError";
  }
}

export async function fetchQuizQuestions(): Promise<QuizApiResponse["data"]> {
  const response = await fetch(quizApiConfig.baseUrl);

  if (!response.ok) {
    throw new QuizApiError(
      `Quiz API request failed: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  const json: QuizApiResponse = await response.json();

  if (!json?.data?.questions) {
    throw new QuizApiError("Invalid quiz API response: missing data.questions");
  }

  return json.data;
}
