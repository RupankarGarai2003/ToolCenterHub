"use client";

import styles from "../Styles/Button.module.css";
import { ArrowUpRight } from "lucide-react";

export default function ExploreButton({ color = "#7808d0" }) {
  return (
    <button className={styles.button} style={{ "--clr": color }}>
      <span className={styles.iconWrapper}>
        {/* Main Icon */}
        <ArrowUpRight className={styles.iconSvg} size={14} />

        {/* Copy Icon */}
        <ArrowUpRight
          className={`${styles.iconSvg} ${styles.iconSvgCopy}`}
          size={14}
        />
      </span>

      Explore All

    </button>
  );
}