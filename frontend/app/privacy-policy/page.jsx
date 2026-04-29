"use client";

import { ShieldCheck, FileDown } from "lucide-react";

export default function PolicyPage() {
  const downloadPDF = () => {
    window.print(); // allows user to save as PDF
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 px-6 py-20">

      {/* HEADER */}
      <section className="max-w-4xl mx-auto text-center">
        <ShieldCheck className="mx-auto text-indigo-600 mb-4" size={42} />

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Privacy Policy 🔒
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Your privacy is important to us.
        </p>

        <button
          onClick={downloadPDF}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          <FileDown size={16} />
          Download as PDF
        </button>
      </section>

      {/* CONTENT */}
      <section className="max-w-4xl mx-auto mt-12 bg-white/70 backdrop-blur-lg p-8 md:p-10 rounded-2xl shadow-md border border-white/40 space-y-8">

        <Section title="Overview">
          ToolCenterHub is committed to protecting your privacy. Our tools are designed to work directly in your browser without storing your data.
        </Section>

        <Section title="Data Collection">
          We do <span className="font-medium text-indigo-600">not collect, store, or share</span> your files or personal data. Everything is processed locally on your device.
        </Section>

        <Section title="Cookies">
          We may use minimal cookies for analytics and improving user experience. These cookies do not store personal or sensitive information.
        </Section>

        <Section title="Security">
          Your files never leave your device. We prioritize security by ensuring that all processing happens locally whenever possible.
        </Section>

        <Section title="GDPR Compliance">
          We follow GDPR principles. Since we do not store personal data, your information remains private and under your control at all times.
        </Section>

        <Section title="Third-Party Services">
          Some features may use trusted third-party services such as analytics providers. These services operate under their own privacy policies.
        </Section>

        <Section title="Policy Updates">
          This Privacy Policy may be updated from time to time. Any changes will be reflected on this page.
        </Section>

        <Section title="Contact">
          If you have any questions or concerns about this Privacy Policy, feel free to contact us.
        </Section>

      </section>

      {/* FOOTER */}
      <div className="text-center mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} ToolCenterHub. All rights reserved.
      </div>
    </div>
  );
}

/* REUSABLE SECTION COMPONENT */
function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">
        {title}
      </h2>
      <p className="text-gray-600 mt-2 leading-relaxed">
        {children}
      </p>
    </div>
  );
}