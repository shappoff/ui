"use client";

import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone = "neutral" | "success" | "warning";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  children: ReactNode;
};

export function Badge({
  tone = "neutral",
  className,
  children,
  ...rest
}: BadgeProps) {
  const classes = ["sui-badge", `sui-badge--${tone}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
