import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import type {
  SentencesTaskData,  
  TransalteTaskData,
} from "../discipline.english.types";
import { vocabulary, sentences } from "../discipline.english.data";

export const solverRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //         createdBy: { connect: { id: ctx.session.user.id } },
  //       },
  //     });
  //   }),

  // getLatest: protectedProcedure.query(async ({ ctx }) => {
  //   // const post = await ctx.db.post.findFirst({
  //   //   orderBy: { createdAt: "desc" },
  //   //   where: { createdBy: { id: ctx.session.user.id } },
  //   // });

  //   return null;
  // }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  // generate a random math task for a 5 class student of school to count in mind
  getMathTask: protectedProcedure.query(() => {
    const firstNumber = Math.floor(Math.random() * 10);
    const secondNumber = Math.floor(Math.random() * 10);
    const operation = Math.random() > 0.5 ? "+" : "-";
    const answer =
      operation === "+"
        ? firstNumber + secondNumber
        : firstNumber - secondNumber;

    return { firstNumber, secondNumber, operation, answer };
  }),

  // saveResult: protectedProcedure.mutation(z.object({ result: z.number() }), async ({ ctx, input }) => {
  //   await ctx.db.result.create({
  //     data: {
  //       result: input.result,
  //       student: { connect: { id: ctx.session.user.id } },
  //     },
  //   });
  // }),

  getTranslateTask: protectedProcedure.query(() => {
    const randomIndex = Math.floor(Math.random() * vocabulary.length);
    const task = vocabulary[randomIndex] as TransalteTaskData;

    return { index: randomIndex, taskData: task };
  }),

  checkTranslateTask: protectedProcedure
    .input(z.object({ index: z.number(), answer: z.string() }))
    .mutation(({ input }) => {
      const task = vocabulary[input.index] as TransalteTaskData;
      if (task.en === input.answer) {
        return "correct!!!";
      }

      return `wrong, '${task.de}' should be '${task.en}' in English`;
    }),

    getSentecesTask: protectedProcedure.query(() => {
      const randomIndex = Math.floor(Math.random() * sentences.length);
      const task = sentences[randomIndex] as SentencesTaskData;
  
      return { index: randomIndex, taskData: task };
    }),

    checkSentencesTask: protectedProcedure
    .input(z.object({ index: z.number(), answer: z.string() }))
    .mutation(({ input }) => {
      const task = sentences[input.index] as SentencesTaskData;
      const correctSentence = task?.sentence.replace(/\{(\d+)\}/g, (match, index: number) =>  task.wordsToFill[index] ?? match);


      if (correctSentence === input.answer) {
        return "correct!!!";
      } else {
        return `wrong, your answer was ${input.answer}, the correct sentence is: '${correctSentence}'`;
      }
    }),
});
