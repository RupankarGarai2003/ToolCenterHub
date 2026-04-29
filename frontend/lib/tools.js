import { tools } from "./toolsList";

const dynamicRules = {
  "image-compressor": {
    getData: (slug) => {
      const sizes = [20, 30, 50, 100, 200, 500];
      const limit =
        sizes.find((s) => slug.includes(`${s}kb`)) || null;

      return { limit };
    },
  },

  "image-converter": {
    getData: (slug) => {
      let format = null;

      if (slug.includes("png")) format = "png";
      if (slug.includes("jpg") || slug.includes("jpeg")) format = "jpg";
      if (slug.includes("webp")) format = "webp";

      return { format };
    },
  },
};

export function getToolConfig(slug) {
  if (!slug) return null;

  // ✅ find tool from toolsList
 const tool = tools.find((t) => slug === t.slug);

  if (!tool) return null;

  // ✅ apply dynamic rule if exists
  const rule = dynamicRules[tool.slug];

  const extraData = rule ? rule.getData(slug) : {};

  return {
    tool: tool.slug,
    ...extraData,
  };
}