export class NoAvailableVehiclesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoAvailableVehiclesError';
  }
}

export class DateRangeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DateRangeError';
  }
}

export class EarlyDeleteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EarlyDeleteError';
  }
}

export class EarlyFeedbackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EarlyFeedbackError';
  }
}

export class FeedbackToDeletedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FeedbackToDeletedError';
  }
}
