"use client";

import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { type TranslateTask } from "@/server/api/discipline.english.types";

export function EnglishTranslate() {
  const utils = api.useUtils();
  const [result, setResult] = useState("");
  const [answer, setAnswer] = useState("");
  const [task, setTask] = useState<TranslateTask | null>(null);

  // Fetch task on component mount
  const [data] = api.solver.getTranslateTask.useSuspenseQuery();
  useEffect(() => {
    setTask(data);
  }, [data]);

  // Mutation to check the answer
  const checkAnswer = api.solver.checkTranslateTask.useMutation({
    onSuccess: async (data) => {
      await utils.solver.invalidate(); // Invalidate cache to refresh data
      setResult(data); // Set the result of the check
    },
  });

  // Handle form submission
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      checkAnswer.mutate({ index: task.index, answer });
      setAnswer(""); // Clear the input after submission
    }
  };


  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {task ? (
          <p className="text-lg font-medium text-gray-800">
            Übersetze das Wort: 
            <span className="text-red-600"> {task.taskData.de}</span>            
          </p>
        ) : (
          <p className="text-lg font-thin text-gray-400">Loading task...</p>
        )}

        <input type="number" hidden value={task?.index ?? ""} readOnly />

        <input
          type="text"
          placeholder="Your answer"
          value={answer}
          autoFocus
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full rounded-full border-2 border-slate-400 px-4 py-2 text-black"
        />

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
        <p className={result == "correct" ? "text-green-500" : "text-red-500"}>
          Result: {result}
        </p>
      )}
    </div>
  );
}
