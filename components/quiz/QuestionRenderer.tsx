import type { QuizQuestion } from "@/types/quiz";
import { AgeQuestion } from "./AgeQuestion";
import { CredentialsQuestion } from "./CredentialsQuestion";
import { GenericInputQuestion } from "./GenericInputQuestion";
import { InputQuestion } from "./InputQuestion";
import { OptionsQuestion } from "./OptionsQuestion";
import { WeightQuestion } from "./WeightQuestion";

type Props = {
  question: QuizQuestion;
  value: unknown;
  onChange: (value: unknown) => void;
  isTransitioning?: boolean;
};

const OPTIONS_TYPES = ["single", "multiple"] as const;
const INPUT_TYPES = ["name"] as const;

export function QuestionRenderer({
  question,
  value,
  onChange,
  isTransitioning = false,
}: Props) {
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

  if (question.type === "weight") {
    return (
      <WeightQuestion
        question={question}
        value={value as string | number | undefined}
        onChange={onChange as (v: number) => void}
        isTransitioning={isTransitioning}
      />
    );
  }

  if (question.type === "age") {
    return (
      <AgeQuestion
        question={question}
        value={value as string | number | undefined}
        onChange={onChange as (v: number) => void}
        isTransitioning={isTransitioning}
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
