import z from 'zod'

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const RegexPasswordValidation =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
})

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})
export const ResetPasswordSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
})
export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Minimum 6 chararters required' })
      .regex(RegexPasswordValidation, {
        message: 'Your password is not valid',
      }),
    confirm: z.string().min(6, { message: 'Minimum 6 chararters required' }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  })
export const RegisterSchema = z
  .object({
    email: z.string().email({ message: 'Email is required' }),
    password: z
      .string()
      .min(8, { message: 'Minimum 8 chararters required' })
      .regex(RegexPasswordValidation, {
        message:
          ' At least one uppercase letter, one lowercase letter, one number and one special character ',
      }),
    confirm: z.string().min(8, { message: "Passwords don't match" }),
    name: z.string().min(1, { message: 'Name is required' }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  })
