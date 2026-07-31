type ApiErrorBody = {
  message?: string | string[];
  error?: string;
  errors?: Array<{ msg?: string; message?: string }>;
};

/**
 * Returns a user-safe error message. Never exposes status codes, Axios
 * internals, stack traces, or other technical details.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    message?: string;
    code?: string;
    response?: { status?: number; data?: ApiErrorBody };
    request?: unknown;
  };

  if (!err?.response) {
    if (err?.code === 'ECONNABORTED' || /timeout/i.test(err?.message ?? '')) {
      return 'The request took too long. Please try again.';
    }
    return 'Unable to connect. Please check your internet and try again.';
  }

  const data = err.response.data;
  const fieldError = data?.errors?.[0]?.msg ?? data?.errors?.[0]?.message;
  const raw = fieldError ?? data?.message ?? data?.error;
  const message = Array.isArray(raw) ? raw[0] : raw;

  if (typeof message !== 'string' || !message.trim()) {
    return fallback;
  }

  const trimmed = message.trim();

  if (isTechnicalMessage(trimmed) || trimmed.toLowerCase() === 'validation failed') {
    return fieldError && !isTechnicalMessage(fieldError) ? fieldError.trim() : fallback;
  }

  return trimmed;
}

function isTechnicalMessage(message: string): boolean {
  return (
    /status code \d+/i.test(message) ||
    /request failed/i.test(message) ||
    /network error/i.test(message) ||
    /ECONNABORTED/i.test(message) ||
    /internal server/i.test(message) ||
    /stack trace/i.test(message) ||
    /\bexception\b/i.test(message) ||
    /\b(prisma|mongo|sequelize|sql)\b/i.test(message)
  );
}
