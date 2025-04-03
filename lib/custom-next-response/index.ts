import { NextResponse } from 'next/server';
import { CustomError, ICustomError } from '../helpers/custom-error';

export class ConflictException extends NextResponse {
  constructor(message: string, customError?: ICustomError) {
    super(
      JSON.stringify({
        message,
        error: CustomError.apiCustomError(customError),
      }),
      {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
