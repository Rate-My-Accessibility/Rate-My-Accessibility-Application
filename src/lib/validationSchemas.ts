import * as Yup from 'yup';

export const AddReviewSchema = Yup.object({
  name: Yup.string().required(),
  content: Yup.string().required(),
  owner: Yup.string().required(),
});

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const HawaiiEmailSchema = Yup.string()
  .trim()
  .lowercase()
  .email('Email is invalid')
  .matches(/^[^\s@]+@hawaii\.edu$/, 'Only @hawaii.edu email addresses are allowed')
  .max(254, 'Email is too long')
  .required('Email is required');

// Keep the existing password limits for compatibility with your current form.
// Do not trim or lowercase passwords.
export const PasswordSchema = Yup.string()
  .strict()
  .min(6, 'Password must be at least 6 characters')
  .max(40, 'Password must not exceed 40 characters')
  .required('Password is required');

export const SignUpSchema = Yup.object({
  email: HawaiiEmailSchema,
  password: PasswordSchema,
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Confirm Password does not match'),
});
