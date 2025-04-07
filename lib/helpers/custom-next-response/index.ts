import { NextResponse } from 'next/server';
import { CustomError, ICustomError } from '../custom-error';

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

export class CustomResponse extends NextResponse {
  constructor(status: number, message: string, customError?: ICustomError) {
    super(
      JSON.stringify({
        message,
        error: CustomError.apiCustomError(customError),
      }),
      {
        status: status,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
