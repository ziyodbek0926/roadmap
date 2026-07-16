import { z } from "zod";
import { REGION_OPTIONS } from "@/lib/regions";

// Mirrors back/schemas.py's PHONE_REGEX exactly: optional "+", 9-15 digits.
const phoneNumberSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .regex(/^\+?\d{9,15}$/, "Enter a valid phone number (9-15 digits, optionally starting with +)");

export const registerSchema = z.object({
  full_name: z.string().trim().min(2, "Full name must be at least 2 characters").max(150, "Full name is too long"),
  phone_number: phoneNumberSchema,
  region: z.enum(REGION_OPTIONS, { error: "Please select your region" }),
  // No age/date_of_birth field, by design -- this platform has no age restriction.
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  phone_number: phoneNumberSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
