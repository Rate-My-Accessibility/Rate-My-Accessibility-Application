import * as React from 'react';

export interface EmailTemplateProps {
  verificationCode: string;
  expiresInMinutes?: number;
}

/** Render on the server using Resend's `react` option. No browser APIs or hooks. */
export function EmailTemplate({
  verificationCode,
  expiresInMinutes = 10,
}: EmailTemplateProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Verify your UHM RateMyAccess email</title>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f3f6f4', fontFamily: 'Arial, Helvetica, sans-serif', color: '#1f2937' }}>
        <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden', opacity: 0 }}>
          Verify your email to continue with UHM RateMyAccess. Your code expires in {expiresInMinutes} minutes.
        </div>
        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f3f6f4' }}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: '32px 12px' }}>
                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={{ maxWidth: '560px', backgroundColor: '#ffffff', border: '1px solid #dfe7e2', borderRadius: '12px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '24px 28px', backgroundColor: '#00563f', borderRadius: '12px 12px 0 0' }}>
                        <p style={{ margin: 0, color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>
                          UHM RateMyAccess
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '32px 28px' }}>
                        <h1 style={{ margin: '0 0 16px', fontSize: '26px', lineHeight: '34px', color: '#12392c' }}>
                          Verify your email
                        </h1>
                        <p style={{ margin: '0 0 24px', fontSize: '16px', lineHeight: '25px' }}>
                          Enter this six-digit code on the signup page you already have open to verify your @hawaii.edu email.
                        </p>
                        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td align="center" style={{ padding: '22px 12px', border: '1px solid #cce1d5', borderRadius: '8px', backgroundColor: '#eef7f1' }}>
                                <p style={{ margin: 0, paddingLeft: '6px', fontFamily: 'Consolas, Courier New, monospace', fontSize: '34px', lineHeight: '42px', fontWeight: 700, letterSpacing: '6px', color: '#00563f' }}>
                                  {verificationCode}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p style={{ margin: '24px 0 12px', fontSize: '15px', lineHeight: '24px' }}>
                          This code expires in <strong>{expiresInMinutes} minutes</strong>. If you requested another code, only the newest one works.
                        </p>
                        <p style={{ margin: '0 0 12px', fontSize: '15px', lineHeight: '24px' }}>
                          Do not share this code with anyone.
                        </p>
                        <p style={{ margin: 0, fontSize: '14px', lineHeight: '23px', color: '#52645b' }}>
                          If you did not request this email, you can ignore it.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '20px 28px', borderTop: '1px solid #e5ece7' }}>
                        <p style={{ margin: 0, fontSize: '12px', lineHeight: '20px', color: '#63736b' }}>
                          Sent by UHM RateMyAccess ·{' '}
                          <a href="https://www.uhm-rma.com/" style={{ color: '#00563f' }}>www.uhm-rma.com</a>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

export default EmailTemplate;
