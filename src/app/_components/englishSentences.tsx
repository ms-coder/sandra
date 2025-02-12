"use client";

import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { type SentencesTask } from "@/server/api/discipline.english.types";

export function EnglishSentences() {
  const utils = api.useUtils();
  const [task, setTask] = useState<SentencesTask | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  // Fetch task on component mount
  const [ data ] = api.solver.getSentecesTask.useSuspenseQuery();
  useEffect(() => {
    if (data) {
      setTask(data);
      const placeholders = data.taskData.sentence.match(/\{[^}]+\}/g) ?? [];
      const initialInputs = placeholders.reduce((acc, placeholder) => {
        acc[placeholder] = "";
        return acc;
      }, {} as Record<string, string>);
      setInputs(initialInputs);
    }
  }, [data]);

  // Mutation to check the answer
  const checkAnswer = api.solver.checkSentencesTask.useMutation({
    onSuccess: (data) => {
      setResult(data); // Set the result of the check
      void utils.solver.invalidate(); // Invalidate cache to refresh data
    },
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, placeholder: string) => {
    const { value } = e.target;
    setInputs((prev) => ({ ...prev, [placeholder]: value }));
  };

  // Handle form submission
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      const filledSentence = task.taskData.sentence.replace(
        /\{[^}]+\}/g,
        (placeholder) => inputs[placeholder] ?? "",
      );
      checkAnswer.mutate({ index: task.index, answer: filledSentence });
    }
  };

  // Split sentence into parts for rendering
  const parts = task?.taskData.sentence.split(/(\{[^}]+\})/g);

  return (
    <div className="col-span-3 rounded-lg bg-white p-6 shadow-lg">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        Fühle die Lücken:
        <div className="rounded-lg bg-gray-100 p-4">
          {parts ? (
            <p>
              {parts.map((part, index) =>
                part.startsWith("{") && part.endsWith("}") ? (
                  <input
                    key={index}
                    type="text"
                    value={inputs[part] ?? ""}
                    onChange={(e) => handleInputChange(e, part)}
                    className="w-17 m-1 rounded-full border-2 border-slate-400 px-1 py-1 text-black"
                  />
                ) : (
                  part
                ),
              )}
            </p>
          ) : (
            <p className="text-lg font-thin text-gray-400">Loading task...</p>
          )}

          <hr className="my-3 border-gray-300" />
          <div className="mt-2 flex gap-2">
            {task?.taskData.wordsToFill.map((word, i) => (
              <div key={i} className="p-2">
                {word}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="rounded-full bg-slate-700/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={checkAnswer.isPending}
        >
          {checkAnswer.isPending ? "Checking answer..." : "Check answer"}
        </button>
      </form>

      {/* Display the result of the check */}
      {result && (
        <p className={result === "correct" ? "text-green-500" : "text-red-500"}>
          Result: {result}
        </p>
      )}
    </div>
  );
}