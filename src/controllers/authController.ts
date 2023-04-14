import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import globalServices from "../services";
import Web3 from "web3";
const web3 = new Web3("https://cloudflare-eth.com/");
const jwtSecret = "mwl45uelkbtuivetbvtgrtytgrb8oy58g45g8[4y50hn58gy54g";
export interface IGetUserAuthInfoRequest extends Request {
  query: any; // or any other type
  authData: any;
  // overriding our Request parameter
}
export const nonceController = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  // creating nonce using current Time
  const nonce = new Date().getTime();
  const { address } = req.query; // destructing user wallet address from query , sent from frontend || index.html file
  // creating a temporary token using nonce and and user wallet address
  // token will expires in 60 second for security purpose , but expiry time would be your choice
  const tempToken = jwt.sign({ nonce, address }, jwtSecret, {
    expiresIn: "60s",
  });
  // now creating a user sign Message
  const message = await globalServices.auth.signMessage(nonce, address);
  // return res.send("Server is Running");
  res.json({
    tempToken,
    message,
  });
};
export const verifyAccount = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { signature } = req.query;
  const authHeader = await req.headers["authorization"];
  const tempToken = authHeader && authHeader.split(" ")[1];
  if (tempToken == null) return res.sendStatus(403); // token is undefined
  // previously created Temporary token
  const userData = await jwt.verify(tempToken, jwtSecret);
  const { nonce = "", address = "" }: any = userData; // decoding token and address
  // crearting sign message
  const message = await globalServices.auth.signMessage(nonce, address);
  // getting address of user wallet using message and signature
  const verifyAddress = await web3.eth.accounts.recover(message, signature);
  console.log("Veriied Address", verifyAddress);
  if (verifyAddress.toLowerCase() == address.toLowerCase()) {
    const token = await jwt.sign({ verifyAddress }, jwtSecret, {
      expiresIn: "1d",
    });
    return res.json({ token });
  } else {
    return res.sendStatus(403);
  }
};
export const secretController = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  res.send(`Welcome address ${req.authData.verifyAddress}`);
};
