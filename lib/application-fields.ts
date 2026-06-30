import { z } from "zod";

export const applicationFieldSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["text", "textarea", "number", "select", "checkbox"]),
  required: z.boolean().optional().default(false),
  placeholder: z.string().optional(),
  helperText: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  options: z.array(z.string()).optional()
});

export type ApplicationField = z.infer<typeof applicationFieldSchema>;

export function parseApplicationFields(value: unknown): ApplicationField[] {
  const result = z.array(applicationFieldSchema).safeParse(value);
  return result.success ? result.data : [];
}

export function validateApplicationAnswers(
  fields: ApplicationField[],
  formData: FormData
) {
  const answers: Record<string, string | boolean | number> = {};
  const errors: string[] = [];

  for (const field of fields) {
    const raw = formData.get(field.id);

    if (field.type === "checkbox") {
      const checked = raw === "on" || raw === "true";
      if (field.required && !checked) {
        errors.push(`${field.label} is required.`);
      }
      answers[field.id] = checked;
      continue;
    }

    const text = typeof raw === "string" ? raw.trim() : "";

    if (field.required && !text) {
      errors.push(`${field.label} is required.`);
      continue;
    }

    if (!text) {
      answers[field.id] = "";
      continue;
    }

    if (field.minLength && text.length < field.minLength) {
      errors.push(`${field.label} must be at least ${field.minLength} characters.`);
    }

    if (field.maxLength && text.length > field.maxLength) {
      errors.push(`${field.label} must be no more than ${field.maxLength} characters.`);
    }

    if (field.type === "number") {
      const number = Number(text);
      if (!Number.isFinite(number)) {
        errors.push(`${field.label} must be a valid number.`);
        continue;
      }
      if (field.min !== undefined && number < field.min) {
        errors.push(`${field.label} must be at least ${field.min}.`);
      }
      if (field.max !== undefined && number > field.max) {
        errors.push(`${field.label} must be no more than ${field.max}.`);
      }
      answers[field.id] = number;
      continue;
    }

    if (field.type === "select" && field.options && !field.options.includes(text)) {
      errors.push(`${field.label} contains an invalid selection.`);
      continue;
    }

    answers[field.id] = text;
  }

  return { answers, errors };
}
