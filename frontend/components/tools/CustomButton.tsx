"use client";
import React from "react";
import styles from "../Styles/CustomButton.module.css";
import { ArrowUpRight,Download  } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "success" |"outline" | "danger" | "explore"| "card"| "download";
  btnSize?: "sm" | "md" | "lg";
  animation?: "none" | "ripple" | "bounce" | "glow";
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  color?: string; // 👈 for explore button
};

export default function CustomButton({
  children,
  variant = "primary",
  btnSize = "md",
  animation = "none",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  color = "#7808d0",
  ...props
}: Props) {

  // 🔥 Ripple logic (same as before)
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (animation !== "ripple") return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;

    const circle = document.createElement("span");

    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.position = "absolute";

    circle.classList.add(styles.rippleEffect);
    button.appendChild(circle);

    setTimeout(() => circle.remove(), 600);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleRipple(e);
    onClick?.(e);
  };

  // 🎯 EXPLORE BUTTON (special render)
  if (variant === "explore") {
    return (
      <button
        className={styles.exploreBtn}
        style={{ "--clr": color } as React.CSSProperties}
        onClick={handleClick}
        {...props}
      >
        <span className={styles.iconWrapper}>
          <ArrowUpRight className={styles.iconSvg} size={14} />
          <ArrowUpRight
            className={`${styles.iconSvg} ${styles.iconSvgCopy}`}
            size={14}
          />
        </span>

        {children || "Explore All"}
      </button>
    );
  }

if (variant === "download") {
  return (
    <button
      className={`${styles.downloadBtn} ${styles[animation]}`}
      onClick={handleClick}
      {...props}
    >
      {/* Lucide Icon */}
      <Download className={styles.downloadIcon} />

      {/* Tooltip */}
      <span className={styles.downloadTooltip}>Download</span>
    </button>
  );
}

  // 🔥 Normal button
  const classNames = [
    styles.btn,
    styles[variant],
    styles[btnSize],
    styles[animation],
    fullWidth ? styles.fullWidth : "",
  ].join(" ");



  return (
    <button className={classNames} onClick={handleClick} {...props}>
      {loading ? (
        <span className={styles.spinner}></span>
      ) : (
        <>
          {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
}