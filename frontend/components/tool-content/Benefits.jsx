"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import styles from "../../components/Styles/tool-component/Benefits.module.css";

// 🔥 Common benefits (for ALL tools)
const commonBenefits = [
  "Saves time and effort",
  "No signup or login required",
  "Secure and private usage",
  "Works on all devices",
  "Completely free to use",
];

// 🔥 Tool-specific benefits (optional)
const toolBenefits = {
  "word-to-pdf": [
    "Easy document sharing",
    "Preserves formatting",
    "Professional PDF output",
  ],
  "image-compressor": [
    "Reduces image size for faster websites",
    "Improves performance and loading speed",
    "Optimizes images without losing quality",
  ],
  "pdf-merger": [
    "Combine multiple PDFs into one file",
    "Organize documents easily",
    "Simplifies file management",
  ],
};

export default function Benefits() {
  const { slug } = useParams();

  // ✅ safe slug handling
  const currentSlug = Array.isArray(slug) ? slug[0] : slug;

  // ✅ merge tool-specific + common benefits
  const items = [
    ...(toolBenefits[currentSlug] || []),
    ...commonBenefits,
  ];

  if (!items.length) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🚀 Why Use This Tool?</h2>

      <div className={styles.grid}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            className={styles.card}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.04 }}
          >
            <div className={styles.icon}>✓</div>
            <p className={styles.text}>{item}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}