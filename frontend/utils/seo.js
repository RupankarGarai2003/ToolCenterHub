// utils/seo.jsx

function formatName(slug) {
  return slug
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getSeoData(tool, limit) {
  const name = formatName(tool);

  // ✅ IMAGE COMPRESSOR
  if (tool === "image-compressor") {
    return {
      title: limit
        ? `Compress Image to ${limit}KB Online Free`
        : "Image Compressor Online Free (Reduce Image Size)",

      description: limit
        ? `Compress image to ${limit}KB without losing quality. Fast, secure, and free online tool.`
        : "Compress JPG, PNG, and WebP images online without losing quality. Fast, secure, and free.",

      keywords:
        "image compressor, compress image online, reduce image size, image optimizer, jpg compressor",
    };
  }

  // ✅ IMAGE TOOLS (generic)
  if (
    tool.includes("image") ||
    tool.includes("jpg") ||
    tool.includes("png")
  ) {
    return {
      title: `${name} Online Free (Fast & Secure Image Tool)`,

      description: `Use our free ${name} tool to convert, resize, or optimize images online. No signup required. Works instantly in your browser.`,

      keywords: `${tool}, ${tool} online, ${tool} free, image tool, image converter, image optimizer`,
    };
  }

  // ✅ PDF TOOLS
  if (tool.includes("pdf")) {
    return {
      title: `${name} - Free PDF Tool Online`,

      description: `Use our ${name} tool to manage PDF files easily. Convert, merge, split, or compress PDFs online for free with secure processing.`,

      keywords: `${tool}, pdf tool, pdf converter, merge pdf, split pdf, compress pdf`,
    };
  }

  // ✅ TEXT / DEV TOOLS
  if (
    tool.includes("json") ||
    tool.includes("base64") ||
    tool.includes("minifier") ||
    tool.includes("encoder") ||
    tool.includes("decoder")
  ) {
    return {
      title: `${name} Tool - Free Developer Utility`,

      description: `Use ${name} online for free. Fast, accurate, and perfect for developers. No installation required.`,

      keywords: `${tool}, developer tool, json tool, encoder, decoder, formatter`,
    };
  }

  // ✅ GENERATORS
  if (tool.includes("generator")) {
    return {
      title: `${name} Online Free Generator Tool`,

      description: `Generate ${name.replace(
        "generator",
        ""
      )} instantly using our free online tool. Fast, secure, and easy to use.`,

      keywords: `${tool}, generator tool, online generator, free generator`,
    };
  }

  // ✅ DEFAULT (fallback for ANY tool)
  return {
    title: `${name} Tool - Free Online Utility`,

    description: `Use our free ${name} tool online. Fast, secure, and works directly in your browser with no signup required.`,

    keywords: `${tool}, ${tool} online, ${tool} free, online tool`,
  };
}