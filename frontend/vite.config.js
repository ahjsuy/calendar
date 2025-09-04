import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8081",
    },
    https: {
      key: fs.readFileSync("../localhost-key.pem"),
      cert: fs.readFileSync("../localhost.pem"),
    },
    public: "https://localhost:8081/",
  },
  define: {
    "process.env": process.env,
  },
});
