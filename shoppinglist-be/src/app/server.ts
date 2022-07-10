import express from "express";
import http from "http";

import { Socket } from "./util/socket";
import { Database } from "./util/database";

import { router as baseRouter } from "../routes/base";
import { router as shoppinglistRouter } from "../routes/shoppinglist";
import { router as authRouter } from "./auth/routes";

const httpPort = 8080;

const app = express();

// listen to auth endpoints
baseRouter.use("/auth", authRouter);

// listen to shoppinglist endpoints
baseRouter.use("/shoppinglist", shoppinglistRouter);

//use base url "api" for baseRouter
app.use("/api", baseRouter);

// create http server
const server = http.createServer(app);

//initiate database
export const database = new Database();

//create websocket server
export const socket = new Socket(server, database);

//start server
server.listen(httpPort, () => {
  console.log(`Server running on port ${httpPort}`);
});
