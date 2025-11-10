// src/app/sitemap.js
export default function sitemap() {
  const base = "https://resolveonline.com.br";

  const pages = [
    { path: "/", priority: 1.0 },
    { path: "/pix", priority: 0.9 },
    { path: "/aereo", priority: 0.9 },
    { path: "/energia", priority: 0.9 },
    { path: "/saude", priority: 0.9 },
    { path: "/sobre", priority: 0.7 },
    { path: "/contato", priority: 0.7 },
    { path: "/politica-de-privacidade", priority: 0.5 },
  ];

  return pages.map((page) => ({
    url: `${base}${page.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: page.priority,
  }));
}
