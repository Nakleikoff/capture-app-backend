export const answers = {
  yes: 1,
  no: -1,
  notSure: 0
} as const;

export const answerValues = Object.values(answers);

export type AnswerKey = keyof typeof answers;
export type AnswerValue = typeof answers[AnswerKey];
