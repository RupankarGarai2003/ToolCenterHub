"use client";

import { useParams } from "next/navigation";
import styles from "../../components/Styles/tool-component/HowToUse.module.css";
import {
  Upload,
  RefreshCw,
  Download,
  FileText,
  ImageIcon,
  ShieldCheck,
  Code2,
  ScanLine,
} from "lucide-react";

// 🔥 Common steps (fallback for ALL tools)
const commonSteps = [
  {
    title: "Upload Your File",
    desc: "Upload or drag and drop your file into the tool interface.",
    icon: <Upload size={32} />,
  },
  {
    title: "Process the File",
    desc: "The tool securely processes your file automatically within seconds.",
    icon: <RefreshCw size={32} />,
  },
  {
    title: "Download the Result",
    desc: "Download your processed file instantly to your device.",
    icon: <Download size={32} />,
  },
];

// 🔥 Dynamic keyword-based steps
const dynamicSteps = {
  pdf: [
    {
      title: "Upload PDF File",
      desc: "Select or drag and drop your PDF document into the tool.",
      icon: <FileText size={32} />,
    },
    {
      title: "Process PDF",
      desc: "The tool will quickly process, convert, merge, split, or compress your PDF securely.",
      icon: <RefreshCw size={32} />,
    },
    {
      title: "Download PDF Result",
      desc: "Download the processed PDF file instantly.",
      icon: <Download size={32} />,
    },
  ],

  image: [
    {
      title: "Upload Image",
      desc: "Upload JPG, PNG, WEBP, or supported image formats.",
      icon: <ImageIcon size={32} />,
    },
    {
      title: "Edit or Convert Image",
      desc: "The tool automatically processes and optimizes your image.",
      icon: <RefreshCw size={32} />,
    },
    {
      title: "Download Image",
      desc: "Save the processed image directly to your device.",
      icon: <Download size={32} />,
    },
  ],

  compressor: [
    {
      title: "Upload File",
      desc: "Upload the file you want to compress securely.",
      icon: <Upload size={32} />,
    },
    {
      title: "Compress File",
      desc: "The tool reduces file size while maintaining quality.",
      icon: <ShieldCheck size={32} />,
    },
    {
      title: "Download Compressed File",
      desc: "Download the optimized compressed file instantly.",
      icon: <Download size={32} />,
    },
  ],

  converter: [
    {
      title: "Choose Input File",
      desc: "Upload the file you want to convert into another format.",
      icon: <Upload size={32} />,
    },
    {
      title: "Convert File",
      desc: "The tool instantly converts the file into your selected format.",
      icon: <RefreshCw size={32} />,
    },
    {
      title: "Download Converted File",
      desc: "Download the converted file with high-quality output.",
      icon: <Download size={32} />,
    },
  ],

  formatter: [
    {
      title: "Paste Your Code",
      desc: "Paste your JSON, HTML, CSS, or other code into the editor.",
      icon: <Code2 size={32} />,
    },
    {
      title: "Format Automatically",
      desc: "The tool beautifies and organizes the structure instantly.",
      icon: <RefreshCw size={32} />,
    },
    {
      title: "Copy Formatted Code",
      desc: "Copy or download the clean formatted result.",
      icon: <Download size={32} />,
    },
  ],

  validator: [
    {
      title: "Paste Data",
      desc: "Paste your JSON or other structured data into the validator.",
      icon: <Code2 size={32} />,
    },
    {
      title: "Validate Content",
      desc: "The tool checks for syntax and formatting errors instantly.",
      icon: <ShieldCheck size={32} />,
    },
    {
      title: "Fix & Use",
      desc: "Review validation results and use the corrected content.",
      icon: <Download size={32} />,
    },
  ],

  qr: [
    {
      title: "Enter Text or URL",
      desc: "Add the link, text, or information you want in the QR code.",
      icon: <ScanLine size={32} />,
    },
    {
      title: "Generate QR Code",
      desc: "The tool instantly creates a high-quality QR code.",
      icon: <RefreshCw size={32} />,
    },
    {
      title: "Download QR Code",
      desc: "Save the generated QR code to your device.",
      icon: <Download size={32} />,
    },
  ],

  password: [
    {
      title: "Select Password Settings",
      desc: "Choose password length and security preferences.",
      icon: <ShieldCheck size={32} />,
    },
    {
      title: "Generate Password",
      desc: "The tool creates a strong and secure password instantly.",
      icon: <RefreshCw size={32} />,
    },
    {
      title: "Copy Password",
      desc: "Copy and use your generated password securely.",
      icon: <Download size={32} />,
    },
  ],

  encoder: [
    {
      title: "Enter Content",
      desc: "Paste the text, URL, or data you want to encode.",
      icon: <Code2 size={32} />,
    },
    {
      title: "Encode Data",
      desc: "The tool safely converts the content into encoded format.",
      icon: <RefreshCw size={32} />,
    },
    {
      title: "Copy Encoded Result",
      desc: "Use or save the encoded output instantly.",
      icon: <Download size={32} />,
    },
  ],

  decoder: [
    {
      title: "Paste Encoded Content",
      desc: "Add the encoded text or data into the decoder.",
      icon: <Code2 size={32} />,
    },
    {
      title: "Decode Instantly",
      desc: "The tool converts encoded content back into readable format.",
      icon: <RefreshCw size={32} />,
    },
    {
      title: "Copy Decoded Result",
      desc: "Use or download the decoded content easily.",
      icon: <Download size={32} />,
    },
  ],
};

export default function HowToUse() {
  const { slug } = useParams();

  // ✅ safe slug handling
  const currentSlug = Array.isArray(slug) ? slug[0] : slug;

  // ✅ auto-detect matching steps
  let autoSteps = commonSteps;

  Object.keys(dynamicSteps).forEach((key) => {
    if (currentSlug?.includes(key)) {
      autoSteps = dynamicSteps[key];
    }
  });

  const steps = autoSteps;

  if (!steps.length) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        How to Use
      </h2>

      <div className={styles.grid}>
        {steps.map((step, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.icon}>
              {step.icon}
            </div>

            <h3 className={styles.stepTitle}>
              {i + 1}. {step.title}
            </h3>

            <p className={styles.desc}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}