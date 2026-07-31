"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  error?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className, id, ...rest }, ref) {
    const inputId = id ?? rest.name;

    return (
      <label className="sui-field">
        {label ? <span className="sui-field__label">{label}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={["sui-input", error ? "sui-input--invalid" : null, className]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        {error ? <span className="sui-field__error">{error}</span> : null}
      </label>
    );
  },
);
