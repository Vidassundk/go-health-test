import { fetchQuizQuestions } from "@/api/quiz";
import { isQuizApiConfigured, QUIZ_API_URL_ERROR_MESSAGE } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

export const QUIZ_QUESTIONS_QUERY_KEY = ["quiz", "questions"] as const;

const configError = new Error(QUIZ_API_URL_ERROR_MESSAGE);

/**
 * Fetches quiz questions through React Query and normalizes the response
 * into a screen-friendly shape, including config-related error fallback.
 */
export function useQuizQuestions() {
  const isConfigured = isQuizApiConfigured();
  const query = useQuery({
    queryKey: QUIZ_QUESTIONS_QUERY_KEY,
    queryFn: fetchQuizQuestions,
    enabled: isConfigured,
  });

  return {
    questions: query.data?.questions ?? null,
    isLoading: isConfigured ? query.isLoading : false,
    isFetching: isConfigured ? query.isFetching : false,
    isError: !isConfigured || query.isError,
    error: (!isConfigured ? configError : query.error) as Error | null,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
}
