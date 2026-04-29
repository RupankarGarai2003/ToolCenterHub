"use client";

import { useParams } from "next/navigation";
import styles from "../../components/Styles/tool-component/About.module.css";

// 🔥 Auto generator function
function generateAbout(slug) {
  if (!slug) return "";

  const name = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return `${name} is a free online tool designed to help you easily process your files quickly and securely. 
You can use this tool directly in your browser without installing any software or creating an account. 

All operations are fast, efficient, and user-friendly, making it perfect for both beginners and professionals. 
Your files remain private and are not stored permanently, ensuring complete security.

Whether you want to convert, compress, edit, or generate files, ${name} provides a reliable solution with high-quality results.`;
}

export default function About() {
  const { slug } = useParams();

  const text = generateAbout(slug);

  if (!text) return null;

  return (
    <div className={styles.container}>
      <div className={styles.topLine}></div>
      <p className={styles.text}>{text}</p>
    </div>
  );
}