import express from "express";
import bodyParser from "body-parser";
import { SqliteError } from "better-sqlite3";
import { DatabaseWrapper } from "./database";
import { Item, customError } from "./types";

//initialize database and creates table if not existent
const database = new DatabaseWrapper();

const app = express();
// Server port
const HTTP_PORT = 8080;
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
app.get("/", (req, res, next) => {
  res.json({ message: "Ok" });
});

// API root endpoint
app.get("/api/", (req, res, next) => {
  res.json({ message: "API Ok" });
});

/**
 * CRUD operation
 */

//Add item
app.post(`${baseSlEndpoint}/item`, (req, res, next) => {
  const body: Item = req.body;
  const propCheck = checkCorrectBodyProps(body);
  if (propCheck.pass) {
    const newId = database.addItem(body);
    res.status(201).json({ oldId: body.id, newId: newId });
    return;
  }

  res.status(400).json(propCheck.response);
});

//Get items
app.get(`${baseSlEndpoint}/items`, (req, res, next) => {
  res.status(200).json(database.getItems());
});

//Update item
app.patch(`${baseSlEndpoint}/item/:id`, (req, res, next) => {
  const body: Item = req.body;
  const propCheck = checkCorrectBodyProps(body);
  if (propCheck.pass) {
    database.updateItem(+req.params.id, body);
    res.status(200).json({ message: "OK" });
    return;
  }
  res.status(400).json(propCheck.response);
});

//Delete item
app.delete(`${baseSlEndpoint}/item/:id`, (req, res, next) => {
  database.deleteItem(+req.params.id);
  res.status(200).json({ message: "OK" });
});

/**
 * Helpers
 */

function checkCorrectBodyProps(item: Item): {
  pass: boolean;
  response?: string;
} {
  const missingProps: string[] = [];
  if (!item.name) {
    missingProps.push("name");
  }

  if (!item.amount) {
    missingProps.push("amount");
  }

  if (!item.id) {
    missingProps.push("id");
  }

  if (missingProps.length !== 0) {
    return {
      pass: false,
      response: `Recieved item is missing following properties: ${missingProps}`,
    };
  }

  return { pass: true };
}

/**
 * error handling
 */
app.use((error, req, res, next) => {
  // catch SQL errors
  if (error instanceof SqliteError) {
    res.status(500).json(error.code);
  }

  // catch custom errors
  else if (error instanceof customError) {
    res.status(500).json(error.message);
  }

  // respond unknown error in order to prevent response containing sensitive data
  else {
    console.log(error);
    res.status(500).json("unknown error");
  }
  next(); // (optional) invoking next middleware
});
