export class ApplicationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}
