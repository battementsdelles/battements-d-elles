import * as z from 'zod';
import { CustomError } from '../helpers/custom-error';

const required = z
  .string({
    message: CustomError.stringify({
      code: 'INVALID_FIELD_REQUIRED',
      details: `Is required.`,
    }),
  })
  .trim()
  .min(1, {
    message: CustomError.stringify({
      code: 'INVALID_FIELD_REQUIRED',
      details: `Is required.`,
    }),
  });

const email = required
  .email({
    message: CustomError.stringify({
      code: 'INVALID_MAIL_REJEX',
      details: `Invalid email address`,
    }),
  })
  .toLowerCase();

const username = (minLength: number = 8, maxLength: number = 30) =>
  required
    .trim()
    .toLowerCase()
    .regex(/^[a-z]/, {
      message: CustomError.stringify({
        code: 'INVALID_USERNAME_REJEX_START',
        details: 'Must start with a letter.',
      }),
    })
    .regex(/^[a-z0-9._-]*$/, {
      message: CustomError.stringify({
        code: 'INVALID_USERNAME_REJEX_ALLOWED_CHARS',
        details: 'Only letters, numbers, ".", "_", and "-" are allowed.',
      }),
    })
    .min(minLength, {
      message: CustomError.stringify({
        code: 'INVALID_USERNAME_MIN_LENGTH',
        details: `Must be at least ${minLength} characters.`,
        values: [minLength],
      }),
    })
    .max(maxLength, {
      message: CustomError.stringify({
        code: 'INVALID_USERNAME_MAX_LENGTH',
        details: `Must not exceed ${maxLength} characters.`,
        values: [maxLength],
      }),
    });

const password = (minLength: number = 8, maxLength: number = 30) =>
  required
    .min(minLength, {
      message: CustomError.stringify({
        code: 'INVALID_PASSWORD_MIN_LENGTH',
        details: `Must be at least ${minLength} characters.`,
        values: [minLength],
      }),
    })
    .max(maxLength, {
      message: CustomError.stringify({
        code: 'INVALID_PASSWORD_MAX_LENGTH',
        details: `Must not exceed ${maxLength} characters.`,
        values: [maxLength],
      }),
    })
    .regex(/[A-Z]/, {
      message: CustomError.stringify({
        code: 'INVALID_PASSWORD_ONE_UPPERCASE',
        details: `Must contain at least one uppercase.`,
      }),
    })
    .regex(/[a-z]/, {
      message: CustomError.stringify({
        code: 'INVALID_PASSWORD_ONE_LOWERCASE',
        details: `Must contain at least one lowercase.`,
      }),
    })
    .regex(/[0-9]/, {
      message: CustomError.stringify({
        code: 'INVALID_PASSWORD_ONE_DIGIT',
        details: `Must contain at least one digit.`,
      }),
    })
    .regex(/[@$!%*?&#]/, {
      message: CustomError.stringify({
        code: 'INVALID_PASSWORD_ONE_SPECIAL_CHAR',
        details: `Must contain at least one special char @$!%*?&#.`,
      }),
    })
    .regex(/^[\w@$!%*?&#]*$/, {
      message: CustomError.stringify({
        code: 'INVALID_PASSWORD_INVALID_CHAR',
        details: `Invalid char used.`,
      }),
    });

export const zodCommonAttributes = {
  email,
  username,
  password,
  required,
};
