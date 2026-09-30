import { z } from "zod";
import { MAX_EXECUTE_CODE_BYTES, MAX_EXECUTE_STDIN_BYTES } from "./remote-execute";

export const executeRequestSchema = z.object({
  language: z.string().trim().min(1, "Missing language"),
  code: z.string().refine((value) => value.trim().length > 0, { error: "Missing code" }),
  stdin: z.string().optional().default(""),
});

export type ExecuteRequestInput = z.infer<typeof executeRequestSchema>;

export function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

export function parseExecuteRequest(body: unknown):
  | { ok: true; value: ExecuteRequestInput }
  | { ok: false; error: string; status: number } {
  const parsed = executeRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid execute request";
    return { ok: false, error: message, status: 400 };
  }
  if (byteLength(parsed.data.code) > MAX_EXECUTE_CODE_BYTES) {
    return {
      ok: false,
      error: `Code exceeds ${MAX_EXECUTE_CODE_BYTES} bytes`,
      status: 413,
    };
  }
  if (byteLength(parsed.data.stdin) > MAX_EXECUTE_STDIN_BYTES) {
    return {
      ok: false,
      error: `stdin exceeds ${MAX_EXECUTE_STDIN_BYTES} bytes`,
      status: 413,
    };
  }
  return { ok: true, value: parsed.data };
}
