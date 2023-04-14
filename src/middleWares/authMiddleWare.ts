import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const jwtSecret = "mwl45uelkbtuivetbvtgrtytgrb8oy58g45g8[4y50hn58gy54g";
export interface IGetUserAuthInfoRequest extends Request {
  authData: {}; // or any other type
  // overriding our Request parameter
}
const authenticateToken = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = await req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); // token is undefined
  jwt.verify(token, jwtSecret, (err: any, authData: any) => {
    if (err) {
      console.log("err in verifing auth token", err);
      return res.sendStatus(403);
    }
    req.authData = authData;
    console.log("req.authData...", req.authData);
    next();
  });
};
module.exports = authenticateToken;
