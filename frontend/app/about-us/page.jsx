"use client";

import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Sparkles,
  Rocket,
  Image,
  FileText,
  Code,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-100 px-6 py-20">

      {/* 🔵 Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* HERO */}
      <section className="relative max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold text-gray-900"
        >
          About ToolCenterHub 🚀
        </motion.h1>

        <p className="text-gray-600 mt-6 text-lg md:text-xl">
          Powerful tools. Zero friction. Built for everyone.
        </p>
      </section>

      {/* DESCRIPTION */}
      <section className="max-w-3xl mx-auto mt-14 text-center">
        <p className="text-gray-700 leading-relaxed text-lg">
          ToolCenterHub provides free online tools for images, PDFs, and developers.
          No installs, no signups — just fast and secure tools that work instantly.
        </p>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-xl text-center"
          >
            <f.icon className="mx-auto text-indigo-600 mb-3" size={32} />
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* STATS */}
      <section className="max-w-5xl mx-auto mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => (
          <div key={i}>
            <h3 className="text-3xl font-bold text-indigo-600">{s.value}</h3>
            <p className="text-gray-600 text-sm">{s.label}</p>
          </div>
        ))}
      </section>

      {/* TOOL CATEGORIES */}
      <section className="max-w-6xl mx-auto mt-24">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Explore Categories
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {categories.map((c, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white shadow hover:shadow-lg text-center"
            >
              <c.icon className="mx-auto text-purple-600 mb-3" size={30} />
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto mt-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          What Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow text-left"
            >
              <p className="text-gray-600">"{t.text}"</p>
              <h4 className="mt-4 font-semibold text-gray-900">
                — {t.name}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center mt-24">
        <motion.a
          whileHover={{ scale: 1.05 }}
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg"
        >
          <Rocket size={18} />
          Explore Tools
        </motion.a>

        <p className="text-gray-500 mt-4 text-sm">
          100% free • No signup required
        </p>
      </section>
    </div>
  );
}

/* DATA */

const features = [
  {
    icon: Zap,
    title: "Blazing Fast",
    desc: "Tools run instantly in your browser.",
  },
  {
    icon: ShieldCheck,
    title: "Secure",
    desc: "Your data is never stored.",
  },
  {
    icon: Sparkles,
    title: "Easy to Use",
    desc: "Simple and clean interface.",
  },
];

const stats = [
  { value: "50+", label: "Tools" },
  { value: "10K+", label: "Users" },
  { value: "100%", label: "Free" },
  { value: "0", label: "Signups" },
];

const categories = [
  {
    icon: Image,
    title: "Image Tools",
    desc: "Compress, resize, convert images easily.",
  },
  {
    icon: FileText,
    title: "PDF Tools",
    desc: "Merge, split, and edit PDFs.",
  },
  {
    icon: Code,
    title: "Developer Tools",
    desc: "JSON, Base64, formatting utilities.",
  },
];

const testimonials = [
  {
    name: "Amit",
    text: "Super fast tools, no ads. Love it!",
  },
  {
    name: "Sara",
    text: "Best free tool site I’ve used.",
  },
  {
    name: "John",
    text: "Clean UI and works perfectly.",
  },
];