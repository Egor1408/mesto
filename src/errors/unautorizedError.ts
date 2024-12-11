import statusCodes from '../constants';

export default class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCodes.UNAUTHORIZED;
  }
}
