import app from "./app.js";
import { logger } from "./lib/logger.js";

// When deployed on Vercel (serverless), export the Express app as the handler.
// Vercel's @vercel/node runtime will invoke it for each request.
export default app;

// When running directly (local dev, Replit, Docker, etc.), start a long-lived server.
if (!process.env.VERCEL) {
  const rawPort = process.env["PORT"] || "3001";

  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  const server = app.listen(port, () => {
    logger.info({ port }, "Server listening");
  });

  server.on("error", (err: Error) => {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  });
}
