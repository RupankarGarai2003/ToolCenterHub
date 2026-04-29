import { tools } from "@/lib/toolsList";
import * as ToolComponents from "@/components/tools";
import { getSeoData } from "@/utils/seo";
import { redirect } from "next/navigation";
import ToolHeading from "../../../components/tools/ToolHeading";

// ✅ Universal parser (UNCHANGED)
function parseSlug(slug) {
  const decoded = decodeURIComponent(slug)
    .toLowerCase()
    .trim();

  const matchedTool = tools.find((t) =>
    decoded.startsWith(t.slug)
  );

  if (!matchedTool) {
    return { tool: decoded, limit: null };
  }

  const limitMatch = decoded.match(/(\d+)kb/);

  return {
    tool: matchedTool.slug,
    limit: limitMatch ? limitMatch[1] : null,
  };
}

// ✅ SEO Metadata (FIXED for Next.js 16)
export async function generateMetadata({ params }) {
  const { slug: rawSlug } = await params; // ✅ REQUIRED in Next 16

  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const { tool, limit } = parseSlug(slug);
  const seo = getSeoData(tool, limit);

  const baseUrl = "http://toolcenterhub.com/"; // 🔥 change this
  const url = `${baseUrl}/tools/${slug}`;

  return {
    title: seo.title || "Free Online Tools",
    description: seo.description || "Use free online tools.",
    keywords: seo.keywords || "online tools, free tools",

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: "Your Tools Site",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

// ✅ Page Component (FIXED for Next.js 16)
export default async function Page({ params }) {
  const { slug: rawSlug } = await params; // ✅ REQUIRED

  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const decoded = decodeURIComponent(slug);

  // 🔥 redirect spaces → hyphens (UNCHANGED)
  if (decoded.includes(" ")) {
    const cleanSlug = decoded.replace(/\s+/g, "-");
    return redirect(`/tools/${cleanSlug}`);
  }

  const { tool, limit } = parseSlug(slug);

  const toolData = tools.find(
    (t) => t.slug.toLowerCase() === tool.toLowerCase()
  );

  if (!toolData) return <div>Tool not found</div>;

  const Component = ToolComponents[toolData.component];
  if (!Component) return <div>Component not found</div>;

  return (
    <div className="p-6">
      <ToolHeading
        title={
          limit
            ? `${toolData.name} (${limit}KB)`
            : toolData.name
        }
        subtitle={toolData.description}
        gradient={true}
      />

      <Component {...(limit ? { limit } : {})} />
    </div>
  );
}