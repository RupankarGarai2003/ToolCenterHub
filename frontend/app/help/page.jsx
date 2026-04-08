"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-white to-[#f5d0fe] px-6 py-16">

      {/* HERO */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900">
          Help Center 🛠️
        </h1>

        <p className="text-gray-600 mt-4">
          Find answers to common questions and learn how to use our tools.
        </p>
      </section>

      {/* FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto mt-12 space-y-4">

        {faqData.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md transition overflow-hidden"
            >
              {/* QUESTION */}
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <span className="font-medium text-gray-900">
                  {item.question}
                </span>

                <ChevronDown
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-indigo-600" : ""
                  }`}
                />
              </button>

              {/* ANSWER */}
              <div
                className={`transition-all duration-300 px-5 ${
                  isOpen ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}

      </section>

      {/* CONTACT */}
      <section className="max-w-3xl mx-auto mt-16 text-center">

        <h2 className="text-2xl font-bold text-gray-900">
          Still need help?
        </h2>

        <p className="text-gray-600 mt-3">
          If you didn’t find your answer, feel free to contact us.
        </p>

        <Link
          href="/contact-us"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow hover:shadow-lg transition"
        >
          Contact Support →
        </Link>

      </section>

    </div>
  );
}

/* FAQ DATA */
const faqData = [
  {
    question: "Are these tools free to use?",
    answer:
      "Yes, all tools on ToolCenterHub are completely free and require no registration.",
  },
  {
    question: "Is my data secure?",
    answer:
      "We prioritize your privacy. Files are processed securely and are not stored permanently.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No installation is required. All tools work directly in your browser.",
  },
  {
    question: "Which file formats are supported?",
    answer:
      "We support common formats like JPG, PNG, PDF, DOCX, and more depending on the tool.",
  },
  {
    question: "Why is my file upload failing?",
    answer:
      "Ensure your file size is within limits and your internet connection is stable.",
  },
];