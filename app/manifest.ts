import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PsarPulse KH",
    short_name: "PsarPulse",
    start_url: "/",
    display: "standalone",
    background_color: "#0E1319",
    theme_color: "#29B28D",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
