import { Server } from "socket.io";
import type http from "http";
import { Item, SocketResponse, SocketRooms } from "./types";
import { Database } from "./database";
import { handleError } from "./helpers/error-handler";
import { mwSocketTokenAuth } from "../auth/middleware";

export class Socket {
  io?: Server;

  constructor(server: http.Server, private database: Database) {
    //create websocket server
    this.io = new Server(server, { path: "/api/socket" });
    this.io.use(mwSocketTokenAuth);

    //listen on websocket connections
    this.io.on("connection", (socket) => {
      console.log("a user connected");

      /**
       * on ADD
       */
      socket.on(SocketRooms.addItem, async (data: { item: Item }, res) => {
        if (typeof data === "string") {
          handleError(
            "Data is a string but should be send as JSON",
            "database_update"
          );
          return;
        }
        console.log(data);
        const response = await database
          .addItem(data.item)

          .then((newItem): SocketResponse => {
            // broadcast added item to all other clients except self
            socket.broadcast.emit(SocketRooms.addItem, { item: newItem });
            return {
              code: 201,
              body: { oldId: data.item.id, newId: newItem.id },
            };
          })

          .catch((err): SocketResponse => {
            const error = handleError(err, "database_add");
            return { code: error.code, error: error.message };
          });
        if (res) {
          res(response);
        }
      });

      /**
       * on GET
       */
      socket.on(SocketRooms.getItems, async (req, res) => {
        const response = await database
          .getItems()

          .then((items): SocketResponse => {
            return {
              code: 200,
              body: items,
            };
          })

          .catch((err): SocketResponse => {
            const error = handleError(err, "database_get");
            return {
              code: error.code,
              error: error.message,
            };
          });

        if (res) {
          res(response);
        }
      });

      /**
       * on UPDATE
       */
      socket.on(SocketRooms.updateItem, async (data: { item: Item }, res) => {
        if (typeof data === "string") {
          handleError(
            "Data is a string but should be send as JSON",
            "database_update"
          );
          return;
        }

        const response = await database
          .updateItem(data.item.id, data.item)

          .then((updatedItem): SocketResponse => {
            // broadcast updated item to all other clients except self
            socket.broadcast.emit(SocketRooms.updateItem, {
              item: updatedItem,
            });
            return {
              code: 200,
              body: "ok",
            };
          })

          .catch((err): SocketResponse => {
            const error = handleError(err, "database_update");
            return {
              code: error.code,
              error: error.message,
            };
          });

        if (res) {
          res(response);
        }
      });

      /**
       * on DELETE
       */
      socket.on(SocketRooms.deleteItem, async (data: { id: number }) => {
        if (typeof data === "string") {
          handleError(
            "Data is a string but should be send as JSON",
            "database_update"
          );
          return;
        }
        await database
          .deleteItem(data.id)

          .then((): SocketResponse => {
            // broadcast deleted id to all other clients except self
            socket.broadcast.emit(SocketRooms.deleteItem, { id: data.id });
            return {
              code: 200,
              body: "ok",
            };
          })

          .catch((err): SocketResponse => {
            const error = handleError(err, "database_delete");
            return {
              code: error.code,
              error: error.message,
            };
          });
      });
    });
  }
}
