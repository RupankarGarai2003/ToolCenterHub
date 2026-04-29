"use client";

import { useState } from "react";
import Link from "next/link";
import { tools } from "@/lib/toolsList";
import "../components/Styles/page.css"
import CustomButton from "../components/tools/CustomButton";

import {
  Image,
  Crop,
  Scissors,
  Maximize,
  FileText,
  Split,
  FileDown,
  Unlock,
  Lock,
  CheckCircle,
  Binary,
  Key,
  FileCode,
  FileJson,
  FileType,
  QrCode,
  Text,
  Link as LinkIcon,
  Repeat,
  LucideIcon,
} from "lucide-react";

/* ICON MAP */
const iconMap: Record<string, LucideIcon> = {
  "image compressor": Image,
  "image converter": Repeat,
  "image cropper": Crop,
  "image resizer": Maximize,
  "background remover": Scissors,
  "jpg to png": Image,
  "png to jpg": Image,

  "pdf compressor": FileText,
  "pdf merger": FileText,
  "pdf splitter": Split,
  "pdf to word": FileDown,
  "pdf to jpg": FileDown,
  "pdf unlock": Unlock,
  "pdf protect": Lock,
  "jpg to pdf": FileText,
  "word to pdf": FileText,

  "json formatter": FileJson,
  "json validator": CheckCircle,
  "html minifier": FileCode,
  "css minifier": FileCode,
  "js minifier": FileCode,

  "base64 encoder": Binary,
  "base64 decoder": Binary,
  "url encoder": LinkIcon,
  "url decoder": LinkIcon,

  "password generator": Key,
  "qr code generator": QrCode,
  "word counter": Text,
};

function getCategory(name: string) {
  const n = name.toLowerCase();

  if (n.includes("image") || n.includes("jpg") || n.includes("png"))
    return "image";

  if (n.includes("pdf") || n.includes("word"))
    return "pdf";

  if (
    n.includes("json") ||
    n.includes("html") ||
    n.includes("css") ||
    n.includes("js")
  )
    return "dev";

  if (n.includes("to")) return "converter";

  return "tool";
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");

  const userChoiceSlugs = [
    "image-compressor",
    "background-remover",
    "pdf-merger",
    "pdf-to-word",
    "qr-code-generator",
    "password-generator",
  ];

  const filteredTools =
    activeTab === "all"
      ? tools
      : activeTab === "choice"
        ? tools.filter((t) => userChoiceSlugs.includes(t.slug))
        : tools.filter((t) => getCategory(t.name) === activeTab);

  const tabs = [
    { label: "All", value: "all" },
    { label: "Image", value: "image" },
    { label: "PDF", value: "pdf" },
    { label: "Dev", value: "dev" },
    { label: "Utility", value: "tool" },
    { label: "⭐ User’s Choice", value: "choice" },
  ];

  const toolColorMap = [
    { types: ["image"], color: "#facc15" },
    { types: ["pdf"], color: "#ef4444" },
    { types: ["word"], color: "#3b82f6" },
    { types: ["jpg"], color: "#a855f7" },
    { types: ["url"], color: "#22c55e" },
    { types: ["json"], color: "#c52274" },
    { types: ["png"], color: "#5a8ec6" },
    { types: ["html", "css", "js"], color: "#bd299f" },
    { types: ["base"], color: "#75d545" },
    { types: ["qr"], color: "#412d3c" },
  ];

  const getToolColor = (name: string) => {
    const n = name.toLowerCase();

    const match = toolColorMap.find(item =>
      item.types.some(type => n.startsWith(type))
    );

    return match ? match.color : "#6b7280";
  };

  return (
    <div className="page">

      {/* HERO */}
      <section className="hero">
        <h1 className="hero-title">
          All-in-One Free{" "}
          <span className="hero-gradient">Online Tools</span> 🚀
        </h1>

        <p className="hero-text">
          Image, PDF, developer & utility tools — fast, free and powerful.
        </p>
      </section>

      {/* TABS */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`tab-btn ${activeTab === tab.value ? "tab-active" : ""
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* GRID */}
      <section className="grid">
        {filteredTools.map((tool) => {
          const name = tool.name.toLowerCase();
          const Icon: LucideIcon = iconMap[name] || FileType;

          return (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <div className="card">

                <div className="glass-icon">
                  <Icon
                    size={25}
                    strokeWidth={2.5}
                    color={getToolColor(tool.name)}
                  />
                </div>

                <h3 className="title">{tool.name}</h3>

                <p className="description">
                  {tool.description}
                </p>

                {/* <div className="card-btn">
                  <button>Explore →</button>
                </div> */}
                <div>
                  <CustomButton variant="card" btnSize="sm">
                    Explore →
                  </CustomButton>
                </div>
              </div>
            </Link>

          );
        })}
      </section>
    </div>
  );
}