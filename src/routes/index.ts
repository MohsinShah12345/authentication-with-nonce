import express, { Router } from "express";
import authRoutes from "./authRoutes";
const serviceRouter: Router = express.Router();
serviceRouter.use("/auth", authRoutes);
export default serviceRouter;
