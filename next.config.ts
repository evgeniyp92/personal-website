// Next.js config. Wires @next/mdx so that .md / .mdx files under `app/` and
// elsewhere are treated as routable/importable React modules. Without the
// `pageExtensions` list, Next only considers .ts/.tsx as valid route files and
// MDX imports would be unrecognized.
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Extend the default page extensions with md/mdx so MDX pages can live next
  // to regular React routes if we ever want file-based MDX routing.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Allow the dev server to accept HMR/asset requests from the phone on the
  // local Wi-Fi. Without this, Next 15+ blocks cross-origin dev traffic, the
  // client bundle never hydrates on the device, and nothing interactive works.
  allowedDevOrigins: ["192.168.*.*"],
};

// createMDX() returns a higher-order config function that layers the MDX
// loader (plus its default rehype/remark pipeline) onto the Next config.
const withMDX = createMDX({});

export default withMDX(nextConfig);
