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
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Authorization required.',
  FORBIDDEN: 'Access denied.',
  VALIDATION_ERROR: 'Data validation error.',
  UNKNOWN_ERROR: 'An unknown error occurred.'
} as const;

export const DEFAULT_PAGE_SIZE = 10;
