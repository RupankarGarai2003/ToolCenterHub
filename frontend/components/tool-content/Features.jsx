"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import styles from "../../components/Styles/tool-component/Features.module.css";

// 🔥 Common features (used for ALL tools)
const commonFeatures = [
  "Fast and easy to use",
  "No signup or login required",
  "Secure processing",
  "Works on all devices",
  "High-quality output",
];

// 🔥 Tool-specific features (optional override)
const toolFeatures = {
  "word-to-pdf": [
    "Convert DOCX to PDF instantly",
    "High-quality PDF output",
    "Preserves formatting",
  ],
  "image-compressor": [
    "Reduce image size quickly",
    "Supports JPG, PNG, WebP",
    "Maintains image quality",
  ],
  "pdf-merger": [
    "Merge multiple PDFs into one",
    "Reorder files easily",
    "Fast PDF processing",
  ],
};

export default function Features() {
  const { slug } = useParams();

  // ✅ handle slug safely
  const currentSlug = Array.isArray(slug) ? slug[0] : slug;

  // ✅ merge specific + common features
  const items = [
    ...(toolFeatures[currentSlug] || []),
    ...commonFeatures,
  ];

  if (!items.length) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>✨ Features</h2>

      <div className={styles.grid}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className={styles.card}
          >
            <div className={styles.glow}></div>

            <div className={styles.content}>
              <div className={styles.icon}>{i + 1}</div>
              <p className={styles.text}>{item}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}