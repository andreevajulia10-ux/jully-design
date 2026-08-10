"use client";

import type { MouseEventHandler, ReactNode } from "react";

type PortfolioButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
};

export function PortfolioButton({
  children,
  href,
  className = "",
  onClick,
  ariaLabel,
}: PortfolioButtonProps) {
  const classes = ["pill-button", className].filter(Boolean).join(" ");
  const content = (
    <>
      <span className="pill-label">{children}</span>
      <span className="pill-icon" aria-hidden="true">
        <img
          className="pill-arrow pill-arrow-default"
          src="/assets/button-arrow.png"
          alt=""
        />
        <img
          className="pill-arrow pill-arrow-hover"
          src="/assets/button-arrow-hover.png"
          alt=""
        />
      </span>
    </>
  );

  if (href) {
    return (
      <a className={classes} href={href} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
