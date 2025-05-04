import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

// Log function to add timestamps and source to logs
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Setup Vite server with middleware mode for development
export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // Use Vite's middleware in the Express app
  app.use(vite.middlewares);

  // Cache the template to avoid reading it from disk on every request
  let cachedTemplate: string | null = null;
  const clientTemplate = path.resolve(import.meta.dirname, "..", "client", "index.html");

  // Function to read the template file and cache it
  const readTemplate = async () => {
    if (!cachedTemplate) {
      cachedTemplate = await fs.promises.readFile(clientTemplate, "utf-8");
    }
    return cachedTemplate;
  };

  // Serve HTML pages with HMR support for development
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const template = await readTemplate();
      const page = await vite.transformIndexHtml(url, template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      ));
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      log("Error while processing template: " + (e as Error).message, "vite");
      next(e);
    }
  });
}

// Serve static files in production
export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // Fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// Graceful shutdown
export function gracefulShutdown(server: Server) {
  process.on("SIGINT", () => {
    console.log("Shutting down server...");
    server.close(() => {
      console.log("Server shut down gracefully");
    });
  });

  process.on("SIGTERM", () => {
    console.log("Shutting down server...");
    server.close(() => {
      console.log("Server shut down gracefully");
    });
  });
}

