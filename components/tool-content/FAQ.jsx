"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../components/Styles/tool-component/FAQ.module.css";

// ✅ Common FAQ (for all tools)
const commonFAQ = [
  {
    q: "Is this tool free to use?",
    a: "Yes, this tool is completely free and can be used without any hidden charges or subscriptions.",
  },
  {
    q: "Do I need to create an account?",
    a: "No, you can use all ToolCenterHub tools instantly without registration or login.",
  },
  {
    q: "Are my files secure?",
    a: "Yes, files are processed securely and are not permanently stored on our servers.",
  },
  {
    q: "Can I use this tool on mobile devices?",
    a: "Yes, all tools are fully responsive and work on mobile phones, tablets, laptops, and desktops.",
  },
  {
    q: "Do I need to install software?",
    a: "No, everything works directly in your browser without downloading or installing anything.",
  },
];

// ✅ Dynamic keyword-based FAQs
const dynamicFAQ = {
  pdf: [
    {
      q: "Does this tool support PDF files?",
      a: "Yes, this tool is optimized for fast and reliable PDF processing with high-quality results.",
    },
    {
      q: "Will the PDF formatting stay intact?",
      a: "Yes, we try to preserve the original formatting, layout, and quality as accurately as possible.",
    },
  ],

  image: [
    {
      q: "Which image formats are supported?",
      a: "Popular image formats such as JPG, PNG, WEBP, and more are supported depending on the tool.",
    },
    {
      q: "Will image quality be reduced?",
      a: "The tool is optimized to maintain the best possible image quality during processing.",
    },
  ],

  compressor: [
    {
      q: "How much can files be compressed?",
      a: "Compression results depend on the original file size and format, but we aim for maximum reduction with minimal quality loss.",
    },
    {
      q: "Will compression affect quality?",
      a: "Slight quality reduction may occur in some cases, but we optimize files to maintain high quality.",
    },
  ],

  converter: [
    {
      q: "Can I convert files instantly?",
      a: "Yes, file conversion starts immediately after upload and usually completes within seconds.",
    },
    {
      q: "Which file formats are supported?",
      a: "Supported formats depend on the specific tool and may include PDF, JPG, PNG, DOCX, and more.",
    },
  ],

  merger: [
    {
      q: "Can I merge multiple files together?",
      a: "Yes, this tool allows you to combine multiple files into a single organized document.",
    },
  ],

  splitter: [
    {
      q: "Can I split files into smaller parts?",
      a: "Yes, you can easily divide files into separate sections or pages.",
    },
  ],

  formatter: [
    {
      q: "Does this tool format code automatically?",
      a: "Yes, the formatter automatically beautifies and organizes your code or data structure.",
    },
  ],

  validator: [
    {
      q: "Can this tool detect errors?",
      a: "Yes, validation tools instantly identify formatting and syntax issues.",
    },
  ],

  minifier: [
    {
      q: "Why should I minify code?",
      a: "Minification reduces file size and improves website loading speed and performance.",
    },
  ],

  encoder: [
    {
      q: "What does encoding do?",
      a: "Encoding converts text or URLs into a safe encoded format for secure transmission and web usage.",
    },
  ],

  decoder: [
    {
      q: "Can encoded data be restored?",
      a: "Yes, decoding converts encoded content back into its original readable format.",
    },
  ],

  qr: [
    {
      q: "Can I generate QR codes instantly?",
      a: "Yes, QR codes are generated instantly and can be downloaded immediately.",
    },
  ],

  password: [
    {
      q: "Are generated passwords secure?",
      a: "Yes, passwords are generated using strong random patterns for better security.",
    },
  ],

  counter: [
    {
      q: "What can this counter calculate?",
      a: "The tool can count words, characters, sentences, and more depending on the content.",
    },
  ],

  url: [
    {
      q: "Why would I encode or decode a URL?",
      a: "URL encoding helps safely transmit special characters in web addresses.",
    },
  ],
};

export default function FAQ() {
  const { slug } = useParams();
  const [open, setOpen] = useState(null);

  // ✅ safe slug handling
  const currentSlug = Array.isArray(slug) ? slug[0] : slug;

  // ✅ auto detect FAQs
  let autoFAQ = [];

  Object.keys(dynamicFAQ).forEach((key) => {
    if (currentSlug?.includes(key)) {
      autoFAQ.push(...dynamicFAQ[key]);
    }
  });

  // ✅ remove duplicate questions
  const faqs = [...autoFAQ, ...commonFAQ].filter(
    (item, index, self) =>
      index === self.findIndex((f) => f.q === item.q)
  );

  if (!faqs.length) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        ❓ Frequently Asked Questions
      </h2>

      <div className={styles.grid}>
        {faqs.map((f, i) => (
          <div
            key={i}
            className={`${styles.item} ${
              open === i ? styles.active : ""
            }`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className={styles.header}>
              <p className={styles.question}>
                {f.q}
              </p>

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
                  <p className={styles.answer}>
                    {f.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}