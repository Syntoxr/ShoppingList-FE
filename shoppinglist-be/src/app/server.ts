import express from "express";
import bodyParser from "body-parser";
import { DatabaseWrapper } from "./database";
import { Item } from "./types";

//initialize database and creates table if not existent
const database = new DatabaseWrapper();

const app = express();
// Server port
const HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
  console.log(
    "Server running on port %PORT%".replace("%PORT%", HTTP_PORT.toString())
  );
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const baseSlEndpoint = "/api/shoppinglist";

// Root endpoint
app.get("/api/", (req, res, next) => {
  res.json({ message: "Ok" });
});

//Add item
app.post(`${baseSlEndpoint}/item`, (req, res, next) => {
  const body: Item = req.body;
  const newId = database.addItem(body);
  res.json({ oldId: body.id, newId: newId });
});

//Get items
app.get(`${baseSlEndpoint}/items`, (req, res, next) => {
  res.json(database.getItems());
});

//Update item
app.patch(`${baseSlEndpoint}/item/:id`, (req, res, next) => {
  const body: Item = req.body;
  database.updateItem(+req.params.id, body);
  res.json({ message: "OK" });
});

//Delete item
app.delete(`${baseSlEndpoint}/item/:id`, (req, res, next) => {
  database.deleteItem(+req.params.id);
  res.json({ message: "OK" });
});
