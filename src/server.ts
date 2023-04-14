// import packages
import express, { Express } from "express";
import globalRoutes from "./routes";
// creating express instance;
const app: Express = express();
// Port for our server || application
const port = 7000;
// code below will configure axpress application to server static file present in public folder
app.use(express.static("public"));
// safe route
app.use("/api/v1", globalRoutes);
// here verify our temptoken generated with nonce and return new bearer token

// app will listen on Port
app.listen(port, () => {
  console.log(`App is listening on Port: ${port}`);
});
