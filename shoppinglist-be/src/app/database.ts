import Database from "better-sqlite3";
import { Item } from "./types";

export class DatabaseWrapper {
  private DBSOURCE = "db.sqlite";
  private database = new Database(this.DBSOURCE, { verbose: console.log });

  constructor() {
    const createTableStmt = `CREATE TABLE IF NOT EXISTS shoppinglist (
                    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                    'name' text UNIQUE,
                    'amount' INTEGER,
                    'onShoppinglist' INTEGER
                );`;

    this.database.exec(createTableStmt);
  }

  addItem(item: Item) {
    const stmt = this.database
      .prepare(
        `INSERT INTO shoppinglist (name, amount, onShoppinglist)
                  VALUES (?, ?, ?)`
      )
      .run(item.name, item.amount, item.onShoppinglist ? 1 : 0);
    return stmt.lastInsertRowid;
  }

  getItems() {
    const items: Item[] = this.database
      .prepare(
        `SELECT *
    FROM shoppinglist;`
      )
      .all();
    return items;
  }

  updateItem(id: number, item: Item) {
    this.database
      .prepare(
        `UPDATE shoppinglist 
      SET name = ?, amount = ?, onShoppinglist = ? 
      WHERE id = ?;`
      )
      .run(item.name, item.amount, item.onShoppinglist ? 1 : 0, id);
  }

  deleteItem(id: number) {
    this.database
      .prepare(
        `DELETE FROM shoppinglist
    WHERE id = ?`
      )
      .run(id);
  }
}
