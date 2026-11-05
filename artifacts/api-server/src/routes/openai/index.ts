import { Router } from "express";
import conversationsRouter from "./conversations.js";

const router = Router();

router.use("/conversations", conversationsRouter);

export default router;
