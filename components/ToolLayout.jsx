"use client";

export default function ToolLayout({ title, children }) {
  return (
    <div className="container flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">{title}</h1>
        {children}
      </div>
    </div>
  );
}