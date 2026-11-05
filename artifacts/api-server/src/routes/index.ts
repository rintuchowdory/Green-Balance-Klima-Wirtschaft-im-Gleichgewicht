import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import dashboardRouter from "./dashboard.js";
import conflictsRouter from "./conflicts.js";
import statesRouter from "./states.js";
import pollsRouter from "./polls.js";
import debateRouter from "./debate.js";
import simulatorRouter from "./simulator.js";
import openaiRouter from "./openai/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/dashboard", dashboardRouter);
router.use("/conflicts", conflictsRouter);
router.use("/states", statesRouter);
router.use("/polls", pollsRouter);
router.use("/debate", debateRouter);
router.use("/simulator", simulatorRouter);
router.use("/openai", openaiRouter);

export default router;
