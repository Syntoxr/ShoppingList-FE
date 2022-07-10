import express from "express";
import { mwTokenAuth } from "../app/auth/middleware";
import { database, socket } from "../app/server";
import { handleError } from "../app/util/helpers/error-handler";
import { resourceLimiter } from "../app/util/helpers/resource-rate-limiter";
import { Item, SocketRooms } from "../app/util/types";

const router = express.Router();

router.use(resourceLimiter);
router.use(mwTokenAuth);
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/**
 * CRUD operations
 */
//Add item
router.post("/item", async (req, res, next) => {
  const item: Item = req.body.item;
  await database
    .addItem(item)

    .then((item) => {
      socket.io?.emit(SocketRooms.addItem, { item: item });
      res.status(201).json({ oldId: item.id, newId: item.id });
    })

    .catch((err) => {
      const error = handleError(err, "database_add");
      res.status(error.code).json({ message: error.message });
    });
});

//Get items
router.get("/items", async (req, res, next) => {
  console.log("GET requested");
  await database
    .getItems()

    .then((items) => {
      res.status(200).json({ items: items });
    })

    .catch((err) => {
      const error = handleError(err, "database_get");
      res.status(error.code).json({ message: error.message });
    });
});

//Update item
router.patch("/item/:id", async (req, res, next) => {
  const body: Item = req.body;
  await database
    .updateItem(+req.params.id, body)
    .then((item) => {
      socket.io?.emit(SocketRooms.updateItem, { item: item });
      res.status(200).json({ message: "OK" });
    })

    .catch((err) => {
      const error = handleError(err, "database_update");
      res.status(error.code).json({ message: error.message });
    });
});

//Delete item
router.delete("/item/:id", async (req, res, next) => {
  await database
    .deleteItem(+req.params.id)

    .then(() => {
      socket.io?.emit(SocketRooms.deleteItem, { id: +req.params.id });
      res.status(200).json({ message: "OK" });
    })

    .catch((err) => {
      const error = handleError(err, "database_delete");
      res.status(error.code).json({ message: error.message });
    });
});

/**
 * error handling
 */
router.use((error, req, res, next) => {
  // respond unknown error in order to prevent response containing sensitive data
  console.log(error);
  res.status(500).json("unknown error");
  next(); // (optional) invoking next middleware
});

export { router };
