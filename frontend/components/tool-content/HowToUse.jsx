"use client";

import { useParams } from "next/navigation";
import styles from "../../components/Styles/tool-component/HowToUse.module.css";
import { Upload, RefreshCw, Download } from "lucide-react";

// 🔥 Common steps (fallback for ALL tools)
const commonSteps = [
  {
    title: "Upload Your File",
    desc: "Upload or drag and drop your file into the tool.",
    icon: <Upload size={32} />,
  },
  {
    title: "Process the File",
    desc: "The tool will automatically process your file quickly and securely.",
    icon: <RefreshCw size={32} />,
  },
  {
    title: "Download Result",
    desc: "Download your processed file instantly to your device.",
    icon: <Download size={32} />,
  },
];

// 🔥 Optional tool-specific overrides
const toolSteps = {
  "word-to-pdf": [
    {
      title: "Upload DOCX File",
      desc: "Upload your Word (.docx) file using the upload box.",
      icon: <Upload size={32} />,
    },
    {
      title: "Convert to PDF",
      desc: "Wait while the tool converts your document into PDF format.",
      icon: <RefreshCw size={32} />,
    },
    {
      title: "Download PDF",
      desc: "Download your high-quality PDF file instantly.",
      icon: <Download size={32} />,
    },
  ],

  "jpg-to-png": [
    {
      title: "Upload JPG Images",
      desc: "Select or drag and drop JPG images into the tool.",
      icon: <Upload size={32} />,
    },
    {
      title: "Convert to PNG",
      desc: "The tool converts your images into PNG format instantly.",
      icon: <RefreshCw size={32} />,
    },
    {
      title: "Download PNG",
      desc: "Download your converted PNG images.",
      icon: <Download size={32} />,
    },
  ],
};

export default function HowToUse() {
  const { slug } = useParams();

  // ✅ safe slug handling
  const currentSlug = Array.isArray(slug) ? slug[0] : slug;

  // ✅ use specific steps or fallback to common
  const steps = toolSteps[currentSlug] || commonSteps;

  if (!steps.length) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>How to Use</h2>

      <div className={styles.grid}>
        {steps.map((step, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.icon}>{step.icon}</div>

            <h3 className={styles.stepTitle}>
              {i + 1}. {step.title}
            </h3>

            <p className={styles.desc}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}