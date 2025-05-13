export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager'
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Пожалуйста, проверьте подключение к интернету.',
  NOT_FOUND: 'Ресурс не найден.',
  UNAUTHORIZED: 'Необходима авторизация.',
  FORBIDDEN: 'Доступ запрещен.',
  VALIDATION_ERROR: 'Ошибка валидации данных.',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка.'
} as const;
