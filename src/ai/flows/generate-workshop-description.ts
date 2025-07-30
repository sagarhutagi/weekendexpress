'use server';

/**
 * @fileOverview An AI agent for generating engaging workshop descriptions.
 *
 * - generateWorkshopDescription - A function that generates workshop descriptions.
 * - GenerateWorkshopDescriptionInput - The input type for the generateWorkshopDescription function.
 * - GenerateWorkshopDescriptionOutput - The return type for the generateWorkshopDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWorkshopDescriptionInputSchema = z.object({
  category: z.string().describe('The category of the workshop.'),
  time: z.string().describe('The time of the workshop.'),
  presenter: z.string().describe('The presenter of the workshop.'),
  keywords: z.string().describe('keywords to include in the description'),
});
export type GenerateWorkshopDescriptionInput = z.infer<
  typeof GenerateWorkshopDescriptionInputSchema
>;

const GenerateWorkshopDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated workshop description.'),
});
export type GenerateWorkshopDescriptionOutput = z.infer<
  typeof GenerateWorkshopDescriptionOutputSchema
>;

export async function generateWorkshopDescription(
  input: GenerateWorkshopDescriptionInput
): Promise<GenerateWorkshopDescriptionOutput> {
  return generateWorkshopDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkshopDescriptionPrompt',
  input: {schema: GenerateWorkshopDescriptionInputSchema},
  output: {schema: GenerateWorkshopDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating engaging workshop descriptions.

  Based on the details provided, generate a compelling and informative description for the workshop.
  Incorporate the category, time, presenter, and the following keywords of the class to make it appealing to potential participants.

  Category: {{{category}}}
  Time: {{{time}}}
  Presenter: {{{presenter}}}
  Keywords: {{{keywords}}}

  Description:`,
});

const generateWorkshopDescriptionFlow = ai.defineFlow(
  {
    name: 'generateWorkshopDescriptionFlow',
    inputSchema: GenerateWorkshopDescriptionInputSchema,
    outputSchema: GenerateWorkshopDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
