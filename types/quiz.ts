export type QuestionType = "single" | "multiple" | "weight" | "name" | "age" | "credentials";

export interface QuestionOption {
  title: string;
  value: string;
}

export interface VisibleIf {
  question: string;
  value: string;
}

export interface QuizQuestion {
  key: string;
  subtitle: string;
  title: string;
  type: QuestionType;
  options?: QuestionOption[];
  visibleIf?: VisibleIf;
}

export interface QuizApiResponse {
  data: {
    questions: QuizQuestion[];
  };
}
