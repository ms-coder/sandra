export type TranslateTask = {
  index: number;
  taskData: TransalteTaskData;
};

export type TransalteTaskData = {
  en: string;
  de: string;
};

export type SentencesTask = {
  index: number;
  taskData: SentencesTaskData;
};

export type SentencesTaskData = {
  sentence: string;
  wordsToFill: string[];
};