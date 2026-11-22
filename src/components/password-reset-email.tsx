import * as React from 'react';

export function PasswordResetEmail({ resetUrl }: { resetUrl: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Reset your UHM RateMyAccess password</title>
      </head>
      <body style={{ margin: 0, backgroundColor: '#f3f6f4', color: '#1f2937', fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
          <tbody><tr><td align="center" style={{ padding: '32px 12px' }}>
            <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={{ maxWidth: '560px', backgroundColor: '#fff', border: '1px solid #dfe7e2', borderRadius: '12px' }}>
              <tbody>
                <tr><td style={{ padding: '24px', backgroundColor: '#00563f', borderRadius: '12px 12px 0 0', color: '#fff', fontSize: '20px', fontWeight: 700 }}>UHM RateMyAccess</td></tr>
                <tr><td style={{ padding: '28px' }}>
                  <h1 style={{ margin: '0 0 16px', fontSize: '26px', color: '#12392c' }}>Reset your password</h1>
                  <p style={{ fontSize: '16px', lineHeight: '25px' }}>A password reset was requested for your account. Use the link below to choose a new password.</p>
                  <table role="presentation" cellPadding="0" cellSpacing="0" style={{ margin: '24px 0' }}><tbody><tr>
                    <td style={{ backgroundColor: '#00563f', borderRadius: '6px' }}>
                      <a href={resetUrl} style={{ display: 'inline-block', padding: '14px 24px', color: '#fff', fontSize: '16px', fontWeight: 700, textDecoration: 'none' }}>Reset password</a>
                    </td>
                  </tr></tbody></table>
                  <p style={{ fontSize: '15px', lineHeight: '24px' }}>This link expires in <strong>30 minutes</strong> and can be used once. Only the newest reset link works.</p>
                  <p style={{ fontSize: '14px', lineHeight: '23px' }}>If the button does not work, copy this entire link into your browser:</p>
                  <p style={{ fontSize: '12px', lineHeight: '20px', overflowWrap: 'anywhere', wordBreak: 'break-all' }}><a href={resetUrl} style={{ color: '#00563f' }}>{resetUrl}</a></p>
                  <p style={{ fontSize: '14px', lineHeight: '23px', color: '#52645b' }}>If you did not request a reset, ignore this email. Your password has not changed. Do not share this link.</p>
                </td></tr>
              </tbody>
            </table>
          </td></tr></tbody>
        </table>
      </body>
    </html>
  );
}
