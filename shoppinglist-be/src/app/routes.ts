import express from "express";
import { database, socket } from "./server";
import { handleError } from "./util/helpers";
import { Item, SocketRooms } from "./util/types";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const baseSlEndpoint = "/api/shoppinglist";

// Root endpoint
router.get("/", (req, res, next) => {
  res.json({ message: "Ok" });
});

// API root endpoint
router.get("/api/", (req, res, next) => {
  res.json({ message: "API Ok" });
});

/**
 * CRUD operations
 */
//Add item
router.post(`${baseSlEndpoint}/item`, async (req, res, next) => {
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
console.log("listening on GET");
router.get(`${baseSlEndpoint}/items`, async (req, res, next) => {
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
router.patch(`${baseSlEndpoint}/item/:id`, async (req, res, next) => {
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
router.delete(`${baseSlEndpoint}/item/:id`, async (req, res, next) => {
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

export default router;
