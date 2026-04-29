"use client";

import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw, Shield } from "lucide-react";

export default function JSONValidator() {
  const [input, setInput] = useState("");
  const [valid, setValid] = useState(null);
  const [error, setError] = useState("");

  const validateJSON = () => {
    try {
      JSON.parse(input);
      setValid(true);
      setError("");
    } catch (err) {
      setValid(false);
      setError(err.message);
    }
  };

  const reset = () => {
    setInput("");
    setValid(null);
    setError("");
  };

  return (
    <div className="min-h-screen flex  justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-6 space-y-6">

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JSON here..."
          className="w-full h-80 p-4 border border-dashed border-blue-400 rounded-xl font-semibold text-sm outline-none"
        />

        {valid === true && (
          <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-sm">
            <CheckCircle size={18} /> Valid JSON
          </div>
        )}

        {valid === false && (
          <div className="text-red-600 text-sm space-y-1">
            <div className="flex items-center justify-center gap-2 font-semibold text-sm">
              <XCircle size={18} /> Invalid JSON
            </div>
            <p className="text-center break-all font-semibold text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={validateJSON}
            className="custom-btn font-semibold text-sm"
          >
            Validate
          </button>

          <button
            onClick={reset}
            className="custom-btn font-semibold text-sm flex items-center gap-2"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

      <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
        <Shield size={18} />
        Your files remain private
      </p>
      </div>
    </div>
  );
}
