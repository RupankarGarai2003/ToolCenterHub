"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import styles from "../../components/Styles/tool-component/Features.module.css";

// 🔥 Common features (used for ALL tools)
const commonFeatures = [
  "Fast and easy to use",
  "No signup or login required",
  "Secure and private processing",
  "Works on mobile, tablet, and desktop",
  "High-quality output results",
];

// 🔥 Dynamic keyword-based features
const dynamicFeatures = {
  pdf: [
    "Advanced PDF processing support",
    "Fast PDF conversion and editing",
    "Preserves document formatting",
  ],

  image: [
    "Supports popular image formats",
    "Optimized image processing",
    "Smooth and responsive workflow",
  ],

  compressor: [
    "Reduce file size instantly",
    "Optimized compression technology",
    "Maintain quality while compressing",
  ],

  converter: [
    "Convert files within seconds",
    "Supports multiple file formats",
    "Simple drag-and-drop workflow",
  ],

  merger: [
    "Combine multiple files into one",
    "Easy document organization",
    "Quick file merging process",
  ],

  splitter: [
    "Split files into smaller sections",
    "Extract selected pages easily",
    "Flexible file separation",
  ],

  formatter: [
    "Beautify and organize code",
    "Improves readability instantly",
    "Clean structured formatting",
  ],

  validator: [
    "Detect syntax and formatting errors",
    "Instant validation results",
    "Helpful for debugging workflows",
  ],

  minifier: [
    "Reduce code size efficiently",
    "Improve website loading speed",
    "Optimize frontend performance",
  ],

  encoder: [
    "Safe and reliable encoding",
    "Supports developer workflows",
    "Fast browser-based encoding",
  ],

  decoder: [
    "Instant content decoding",
    "Readable and accurate output",
    "Easy encoded data conversion",
  ],

  qr: [
    "Generate QR codes instantly",
    "Download QR codes easily",
    "Supports links and text",
  ],

  password: [
    "Generate strong secure passwords",
    "Custom password generation",
    "Improved account protection",
  ],

  counter: [
    "Count words and characters instantly",
    "SEO-friendly text analysis",
    "Real-time counting updates",
  ],

  url: [
    "Safe URL encoding and decoding",
    "Supports web-safe formatting",
    "Useful for developers and SEO",
  ],
};

export default function Features() {
  const { slug } = useParams();

  // ✅ handle slug safely
  const currentSlug = Array.isArray(slug) ? slug[0] : slug;

  // ✅ auto-detect matching features
  let autoFeatures = [];

  Object.keys(dynamicFeatures).forEach((key) => {
    if (currentSlug?.includes(key)) {
      autoFeatures.push(...dynamicFeatures[key]);
    }
  });

  // ✅ merge + remove duplicates
  const items = [...new Set([...autoFeatures, ...commonFeatures])];

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
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className={styles.card}
          >
            <div className={styles.glow}></div>

            <div className={styles.content}>
              <div className={styles.icon}>
                {i + 1}
              </div>

              <p className={styles.text}>
                {item}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}