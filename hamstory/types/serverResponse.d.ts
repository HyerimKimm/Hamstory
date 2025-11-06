export type ServerResponseType<T> = Promise<{
  success: boolean;
  message: string;
  data: T | null;
}>;
