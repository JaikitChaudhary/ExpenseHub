export class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly cause: unknown
  ) {
    super(message);
    this.name = "RepositoryError";
  }
}

export async function runRepositoryOperation<T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw new RepositoryError(`Repository operation failed: ${operationName}`, error);
  }
}

export function createRepositoryId() {
  return crypto.randomUUID();
}
