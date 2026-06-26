type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

function timestamp(): string {
  return new Date().toISOString();
}

function log(level: LogLevel, message: string, data?: unknown): void {
  const entry = data
    ? `[${timestamp()}] [${level}] ${message} ${JSON.stringify(data)}`
    : `[${timestamp()}] [${level}] ${message}`;

  if (level === 'ERROR') {
    console.error(entry);
  } else if (level === 'WARN') {
    console.warn(entry);
  } else {
    console.log(entry);
  }
}

export const logger = {
  info: (message: string, data?: unknown) => log('INFO', message, data),
  warn: (message: string, data?: unknown) => log('WARN', message, data),
  error: (message: string, data?: unknown) => log('ERROR', message, data),
  debug: (message: string, data?: unknown) => log('DEBUG', message, data),
  step: (step: string) => log('INFO', `▶ STEP: ${step}`),
};
