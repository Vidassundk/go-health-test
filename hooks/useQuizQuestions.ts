import { fetchQuizQuestions } from "@/api/quiz";
import { useQuery } from "@tanstack/react-query";

export const QUIZ_QUESTIONS_QUERY_KEY = ["quiz", "questions"] as const;

export function useQuizQuestions() {
  const query = useQuery({
    queryKey: QUIZ_QUESTIONS_QUERY_KEY,
    queryFn: fetchQuizQuestions,
  });

  return {
    questions: query.data?.questions ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
}
