import type { Metadata } from 'next';
import ResetPasswordForm from './ResetPasswordForm';

export const runtime = 'nodejs';
export const metadata: Metadata = {
  title: 'Reset password | UHM RateMyAccess',
  referrer: 'no-referrer',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
