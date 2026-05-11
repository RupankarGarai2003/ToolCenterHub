"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import styles from "../../components/Styles/tool-component/Benefits.module.css";
import { tools } from "../../lib/toolsList";

// 🔥 Common benefits (for ALL tools)
const commonBenefits = [
  "Saves time and improves productivity",
  "No signup or login required",
  "Secure and privacy-focused processing",
  "Works on mobile, tablet, and desktop",
  "Completely free and easy to use",
];

// 🔥 Dynamic keyword-based benefits
const dynamicBenefits = {
  pdf: [
    "Fast PDF processing and conversion",
    "High-quality document output",
    "Easy file sharing and management",
  ],

  image: [
    "Optimized image quality and performance",
    "Supports popular image formats",
    "Quick image editing and processing",
  ],

  compressor: [
    "Reduce file size without quality loss",
    "Improve upload and website speed",
    "Save storage space efficiently",
  ],

  converter: [
    "Convert files instantly online",
    "Supports multiple file formats",
    "Simple and user-friendly workflow",
  ],

  merger: [
    "Combine files into a single document",
    "Better file organization",
    "Simplifies document management",
  ],

  splitter: [
    "Split files into smaller sections",
    "Extract only required pages or content",
    "Easy file separation and control",
  ],

  generator: [
    "Generate results instantly",
    "Reliable and accurate output",
    "Useful for developers and professionals",
  ],

  validator: [
    "Detect errors instantly",
    "Improve data accuracy",
    "Helpful for debugging workflows",
  ],

  formatter: [
    "Beautify and organize content",
    "Improve readability",
    "Clean structured output",
  ],

  encoder: [
    "Encode data safely and quickly",
    "Useful for secure web usage",
    "Supports developer workflows",
  ],

  decoder: [
    "Decode content instantly",
    "Readable and accurate output",
    "Simplifies encoded data handling",
  ],

  minifier: [
    "Reduce code size for performance",
    "Improve website loading speed",
    "Optimize frontend assets",
  ],

  password: [
    "Generate strong secure passwords",
    "Improve online account safety",
    "Quick one-click password generation",
  ],

  counter: [
    "Instant text and character analysis",
    "Useful for SEO and content writing",
    "Improves writing productivity",
  ],

  qr: [
    "Generate QR codes instantly",
    "Easy sharing for links and text",
    "Useful for marketing and business",
  ],

  url: [
    "Safe URL processing",
    "Useful for developers and SEO",
    "Fast encoding and decoding",
  ],
};

export default function Benefits() {
  const { slug } = useParams();

  // ✅ safe slug handling
  const currentSlug = Array.isArray(slug) ? slug[0] : slug;

  // 🔥 auto detect matching keywords
  let autoBenefits = [];

  Object.keys(dynamicBenefits).forEach((key) => {
    if (currentSlug?.includes(key)) {
      autoBenefits.push(...dynamicBenefits[key]);
    }
  });

  // ✅ remove duplicate benefits
  const items = [...new Set([...autoBenefits, ...commonBenefits])];

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
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ scale: 1.04 }}
          >
            <div className={styles.icon}>✓</div>

            <p className={styles.text}>
              {item}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}