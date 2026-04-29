"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../components/Styles/tool-component/FAQ.module.css";

// ✅ Common FAQ (for all tools)
const commonFAQ = [
  { q: "Is this tool free to use?", a: "Yes, all tools are completely free with no hidden charges." },
  { q: "Do I need to sign up?", a: "No, you can use all tools without creating an account." },
  { q: "Are my files secure?", a: "Yes, files are processed securely and not stored permanently." },
  { q: "Will my files be saved?", a: "No, your files are automatically deleted after processing." },
  { q: "Can I use this tool on mobile?", a: "Yes, all tools work on mobile, tablet, and desktop devices." },
  { q: "Is there a file size limit?", a: "Large files are supported, but extremely large files may take longer." },
  { q: "Do I need to install anything?", a: "No, everything works directly in your browser." },
  { q: "Will quality be affected?", a: "We maintain high quality; compression tools may slightly reduce file size." },
];

// ✅ Optional tool-specific FAQ
const toolSpecificFAQ = {
  "word-to-pdf": [
    { q: "Does it support .doc files?", a: "No, only .docx files are supported." },
  ],
};

export default function FAQ() {
  const { slug } = useParams();
  const [open, setOpen] = useState(null);

  const faqs = [
    ...(toolSpecificFAQ[slug] || []),
    ...commonFAQ,
  ];

  if (!faqs.length) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>❓ Frequently Asked Questions</h2>

      <div className={styles.grid}>
        {faqs.map((f, i) => (
          <div
            key={i}
            className={`${styles.item} ${open === i ? styles.active : ""}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className={styles.header}>
              <p className={styles.question}>{f.q}</p>
              <span className={styles.icon}>
                {open === i ? "−" : "+"}
              </span>
            </div>

            <AnimatePresence>
              {open === i && (
                <motion.div
                  className={styles.answerWrapper}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className={styles.answer}>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}