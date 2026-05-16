export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  error?: unknown;
};

export function ok<T>(message: string, data: T): ApiSuccess<T> {
  return { success: true, message, data };
}

