import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const fileProtocolCompatibleHtml = () => ({
  name: "file-protocol-compatible-html",
  transformIndexHtml: {
    order: "post",
    handler(html) {
      return html
        .replace('<script type="module" crossorigin', "<script defer")
        .replaceAll('href="/favicon_io/', 'href="../../favicon_io/');
    },
  },
});

export default defineConfig({
  plugins: [react(), fileProtocolCompatibleHtml()],
  base: "./",
});
