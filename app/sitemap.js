import toolsList from "@/toolsList";

export default function sitemap() {
  const baseUrl = "https://toolscenterhub.com";

  const tools = toolsList.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    ...tools,
  ];
}