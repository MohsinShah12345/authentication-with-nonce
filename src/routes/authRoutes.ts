import express, { Router } from "express";
import globalControllers from "../controllers";
const authMiddleWare = require("../middleWares/authMiddleWare");
const authRouter: Router = express.Router();
authRouter
  .get("/nonce", globalControllers.auth.nonceController) // to create temp token using nonce and userWallet Address
  .post("/verify", globalControllers.auth.verifyAccount)
  .get("/secret", authMiddleWare, globalControllers.auth.secretController); // to create permanent token after user sign

export default authRouter;
