import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GenerateInput = z.object({ notes: z.string().min(20) });

export const generateStudySet = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const { buildStudySet } = await import("./study.server");
    return buildStudySet(data.notes);
  });
