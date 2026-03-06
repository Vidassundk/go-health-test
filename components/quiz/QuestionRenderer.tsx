import type { QuizQuestion } from "@/types/quiz";
import { CredentialsQuestion } from "./CredentialsQuestion";
import { GenericInputQuestion } from "./GenericInputQuestion";
import { InputQuestion } from "./InputQuestion";
import { OptionsQuestion } from "./OptionsQuestion";

type Props = {
  question: QuizQuestion;
  value: unknown;
  onChange: (value: unknown) => void;
};

const OPTIONS_TYPES = ["single", "multiple"] as const;
const INPUT_TYPES = ["weight", "name", "age"] as const;

export function QuestionRenderer({ question, value, onChange }: Props) {
  if (OPTIONS_TYPES.includes(question.type as (typeof OPTIONS_TYPES)[number])) {
    return (
      <OptionsQuestion
        question={question}
        value={value as string | string[] | undefined}
        onChange={onChange as (v: string | string[]) => void}
      />
    );
  }

  if (question.type === "credentials") {
    return (
      <CredentialsQuestion
        question={question}
        value={value as { email: string; password: string } | undefined}
        onChange={onChange as (v: { email: string; password: string }) => void}
      />
    );
  }

  if (INPUT_TYPES.includes(question.type as (typeof INPUT_TYPES)[number])) {
    return (
      <InputQuestion
        question={question}
        value={value as string | number | undefined}
        onChange={onChange as (v: string | number) => void}
      />
    );
  }

  return (
    <GenericInputQuestion
      question={question}
      value={value as string | undefined}
      onChange={onChange as (v: string) => void}
    />
  );
}
