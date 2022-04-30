import express from "express";
import http from "http";
import { Database } from "./database";
import { Socket } from "./socket";
import routes from "./routes";

export const app = express();
// listen to endpoint
app.use(routes);

const httpPort = 8080;

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
