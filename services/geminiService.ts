
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ResumeFile } from "../types";

export const analyzeResume = async (
  resume: ResumeFile,
  jobDescription: string
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are an expert HR recruiter and ATS (Applicant Tracking System) specialist. 
  Your task is to analyze the provided resume against the job description.
  Provide a professional, objective, and constructive analysis in JSON format.
  Ensure the matchScore is an integer between 0 and 100.`;

  const prompt = `
    Analyze the following resume in context of the provided Job Description.
    
    JOB DESCRIPTION:
    ${jobDescription}

    RESUME CONTENT:
    (The resume is provided as an attached document part)

    Please return a JSON response with exactly these fields:
    - matchScore: (number 0-100)
    - keyStrengths: (array of strings)
    - missingSkills: (array of strings)
    - improvementSuggestions: (array of strings)
    - atsTips: (array of strings)
    - summary: (string, brief executive overview of the candidate's fit)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: resume.type,
              data: resume.base64.split(",")[1], // Remove the data:application/pdf;base64, prefix
            },
          },
          { text: prompt },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            atsTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
          },
          required: ["matchScore", "keyStrengths", "missingSkills", "improvementSuggestions", "atsTips", "summary"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");

    return JSON.parse(resultText) as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    throw new Error(error.message || "Failed to analyze resume. Please try again.");
  }
};
