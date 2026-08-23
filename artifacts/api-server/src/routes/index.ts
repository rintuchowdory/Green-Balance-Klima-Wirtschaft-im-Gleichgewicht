import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import conflictsRouter from "./conflicts";
import statesRouter from "./states";
import pollsRouter from "./polls";
import debateRouter from "./debate";
import simulatorRouter from "./simulator";
import openaiRouter from "./openai/index";

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
