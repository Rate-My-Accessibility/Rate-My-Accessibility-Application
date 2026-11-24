'use client';

import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  error?: string;
  isInvalid?: boolean;
};

/** A password field with its own keyboard-accessible eye-icon toggle. */
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      label,
      error,
      isInvalid = false,
      id,
      className = '',
      disabled,
      'aria-describedby': describedBy,
      ...inputProps
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const [visible, setVisible] = useState(false);
    const invalid = Boolean(error) || isInvalid;
    const description = [describedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined;

    return (
      <div>
        <div className="position-relative">
          <input
            {...inputProps}
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            className={`form-control${invalid ? ' is-invalid' : ''}${className ? ` ${className}` : ''}`}
            style={{
              ...inputProps.style,
              paddingRight: invalid ? '4.75rem' : '3rem',
              ...(invalid ? { backgroundPosition: 'right 3rem center' } : {}),
            }}
            disabled={disabled}
            aria-label={inputProps['aria-label'] ?? label}
            aria-invalid={invalid || inputProps['aria-invalid']}
            aria-describedby={description}
          />
          <button
              type="button"
              className="password-toggle position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent p-0 me-2 d-inline-flex align-items-center justify-content-center"
              style={{
                width: '32px',
                height: '32px',
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
            onClick={() => setVisible(current => !current)}
            disabled={disabled}
            aria-controls={inputId}
            aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
            title={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
            aria-pressed={visible}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M2 12c2-4.5 5.5-7 10-7s8 2.5 10 7c-2 4.5-5.5 7-10 7S4 16.5 2 12Z" />
              <circle cx="12" cy="12" r="3" />
              {visible && <path d="M3 3l18 18" strokeWidth="2.2" />}
            </svg>
          </button>
        </div>
        {error && <div id={errorId} className="invalid-feedback d-block">{error}</div>}
      </div>
    );
  },
);

export default PasswordInput;
