import app from "./app";
import { logger } from "./lib/logger";

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

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
}
