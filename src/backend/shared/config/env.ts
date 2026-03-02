import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  DIRECT_URL: z.string().min(1).optional(),
  PEXELS_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_API_ORIGIN: z.string().url().optional(),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  PEXELS_API_KEY: process.env.PEXELS_API_KEY,
  NEXT_PUBLIC_API_ORIGIN: process.env.NEXT_PUBLIC_API_ORIGIN,
});

if (!parsed.success) {
  throw new Error("Invalid environment variables configuration.");
}

export const serverEnv = parsed.data;
