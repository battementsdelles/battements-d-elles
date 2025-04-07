import * as z from 'zod';
import { zodCommonAttributes } from '../common-attributes';

const { required } = zodCommonAttributes;

export const LoginSchema = z.object({
  email: required,
  password: required,
});

export type ILoginDto = z.infer<typeof LoginSchema>;
