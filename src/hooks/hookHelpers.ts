import type { Dispatch, SetStateAction } from "react";

export type HookError = Error | null;

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error("An unexpected error occurred.");
}

export async function runHookOperation<T>(
  operation: () => Promise<T>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<HookError>>
): Promise<T | undefined> {
  setLoading(true);
  setError(null);

  try {
    return await operation();
  } catch (error) {
    setError(normalizeError(error));
    return undefined;
  } finally {
    setLoading(false);
  }
}
