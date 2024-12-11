import statusCodes from '../constants';

export default class ConflictError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCodes.CONFLICT;
  }
}
