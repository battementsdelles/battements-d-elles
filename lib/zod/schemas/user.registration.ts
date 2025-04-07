import * as z from 'zod';
import { CustomError } from '../../helpers/custom-error';
import { zodCommonAttributes } from '../common-attributes';

const { email, password, username, required } = zodCommonAttributes;

export const CreateUserSchema = z
  .object({
    email: email,
    username: username(),
    password: password(),
    confirmPassword: required,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: CustomError.stringify({
      code: 'INVALID_CONFIRMATION_PASSWORD',
      details: `Passwords don't match`,
    }),
    path: ['confirmPassword'], // path of error
  })
  .superRefine((data, ctx) => {
    // Check if password contains or equals email or its local part
    const email = data.email;
    const password = data.password.toLowerCase();
    const localPart = email.split('@')[0];

    // If password equals email or contains the email/local part, return error
    if (password.includes(email) || password.includes(localPart)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: CustomError.stringify({
          code: 'INVALID_PASSWORD_CONTAIN_EMAIL',
          details: `Password must not contain the email or its local part.`,
        }),
        path: ['password'],
      });
    }
  });

export type ICreateUserDto = z.infer<typeof CreateUserSchema>;
