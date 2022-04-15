import Database from "better-sqlite3";
import { Item } from "./types";
import { mkdirSync } from "fs";

export class DatabaseWrapper {
  private dbPath = "data";
  private database?: Database.Database;

  constructor() {
    // create data dir if nor already existent
    console.log("creating data dir");
    mkdirSync(this.dbPath, { recursive: true });

    this.database = new Database(this.dbPath + "/db.sqlite", {
      verbose: console.log,
    });

    const createTableStmt = `CREATE TABLE IF NOT EXISTS shoppinglist (
                    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                    'name' text UNIQUE,
                    'amount' INTEGER,
                    'onShoppinglist' INTEGER
                );`;

    this.database.exec(createTableStmt);
  }

  addItem(item: Item) {
    if (!this.database) {
      this.handleError("noDb");
      return;
    }
    const stmt = this.database
      .prepare(
        `INSERT INTO shoppinglist (name, amount, onShoppinglist)
                  VALUES (?, ?, ?)`
      )
      .run(item.name, item.amount, item.onShoppinglist ? 1 : 0);
    return stmt.lastInsertRowid;
  }

  getItems() {
    if (!this.database) {
      this.handleError("noDb");
      return;
    }
    const items: Item[] = this.database
      .prepare(
        `SELECT *
    FROM shoppinglist;`
      )
      .all();
    return items;
  }

  updateItem(id: number, item: Item) {
    if (!this.database) {
      this.handleError("noDb");
      return;
    }
    this.database
      .prepare(
        `UPDATE shoppinglist 
      SET name = ?, amount = ?, onShoppinglist = ? 
      WHERE id = ?;`
      )
      .run(item.name, item.amount, item.onShoppinglist ? 1 : 0, id);
  }

  deleteItem(id: number) {
    if (!this.database) {
      this.handleError("noDb");
      return;
    }
    this.database
      .prepare(
        `DELETE FROM shoppinglist
    WHERE id = ?`
      )
      .run(id);
  }

  private handleError(type: "noDb") {
    switch (type) {
      case "noDb":
        throw "database not defined";
    }
  }
}
