"use client";

import { Mail, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 px-6 py-20">

      {/* HEADER */}
      <section className="max-w-4xl mx-auto text-center">
        <Mail className="mx-auto text-indigo-600 mb-4" size={42} />

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Contact Us 📬
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Have questions, feedback, or suggestions? We'd love to hear from you.
        </p>
      </section>

      {/* CONTACT CARD */}
      <section className="max-w-4xl mx-auto mt-12 bg-white/70 backdrop-blur-lg p-8 md:p-10 rounded-2xl shadow-md border border-white/40">

        {/* EMAIL */}
        <div className="text-center mb-8">
          <p className="text-gray-600">Reach us directly at:</p>
          <p className="text-lg font-semibold text-indigo-600 mt-2">
            support@toolcenterhub.com
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <textarea
            rows={5}
            placeholder="Your Message..."
            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition"
          >
            <Send size={18} />
            Send Message
          </button>
        </form>

      </section>

      {/* FOOTER */}
      <div className="text-center mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} ToolCenterHub. All rights reserved.
      </div>
    </div>
  );
}