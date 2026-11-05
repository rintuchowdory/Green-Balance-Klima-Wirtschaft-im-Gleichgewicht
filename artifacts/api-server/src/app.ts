import express, { type Express } from "express";
import cors from "cors";
import pinoHttpModule from "pino-http";
// NodeNext liefert das Modul als Namespace, deshalb den Aufruf sauber auflösen.
const pinoHttp = ((pinoHttpModule as unknown as { default?: unknown }).default ??
  pinoHttpModule) as unknown as (opts?: Record<string, unknown>) => import("express").RequestHandler;
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: { id?: string; method?: string; url?: string }) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: { statusCode?: number }) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
