import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",      // Génère un dossier /out 100% statique
  trailingSlash: true,   // /album → /album/index.html (requis pour Netlify)
  images: {
    unoptimized: true,   // Obligatoire avec output: export
    remotePatterns: [
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
};

export default nextConfig;
