import { getToolConfig } from "@/lib/tools";
import { tools } from "@/lib/toolsList";
import * as ToolComponents from "@/components/tools";

export default function Page({ params }) {
  const { slug } = params;

  // 🔹 Get tool config
  const config = getToolConfig(slug);

  if (!config) {
    return <div className="text-center p-10">Tool not found</div>;
  }

  // 🔹 Find tool info
  const tool = tools.find((t) => t.slug === config.tool);

  if (!tool) {
    return <div className="text-center p-10">Tool not found</div>;
  }

  // 🔹 Get component dynamically
  const Component = ToolComponents[tool.component];

  if (!Component) {
    return <div className="text-center p-10">Component not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">

      {/* 🔹 Tool Title */}
      <h1 className="text-2xl font-bold text-center mb-6">
        {tool.name}
      </h1>

      {/* 🔹 Tool UI (and content handled inside component) */}
      <Component {...config} />

    </div>
  );
}