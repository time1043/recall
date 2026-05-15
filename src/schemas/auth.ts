import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})
// export type LoginFormType = z.infer<typeof loginFormSchema>

export const signupFormSchema = z.object({
  fullName: z.string().min(5),
  email: z.email(),
  password: z.string().min(6),
})
// export type SignupFormType = z.infer<typeof signupFormSchema>
