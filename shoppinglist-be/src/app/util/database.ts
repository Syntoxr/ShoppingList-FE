import { Sequelize, Model, DataTypes } from "sequelize";
import { Item } from "./types";

export class Database {
  private database = new Sequelize({
    dialect: "sqlite",
    storage: "data/database.sqlite",
  });

  Item = this.database.define<DbItem>("Item", {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    amount: { type: DataTypes.NUMBER, defaultValue: 1 },
    onShoppinglist: { type: DataTypes.BOOLEAN, defaultValue: true },
  });

  constructor() {
    //start database
    console.log("starting database");
    this.database
      .authenticate()
      .then((result) => {
        console.log("Connection established.");
      })
      .catch((error) => {
        console.log("Unable to connect to db: ", error);
      });

    //synchronize database with models
    this.database.sync().then(() => {
      console.log(`Database & tables created!`);
    });
  }

  /**
   *  ADD Item
   * @param item Item to add
   * @param database database to add item to
   * @returns new id of added item
   */
  async addItem(item: Item) {
    const addedDbItem = await this.Item.create({
      name: item.name,
      amount: item.amount,
      onShoppinglist: item.onShoppinglist,
    });

    const addedItem: Item = {
      name: addedDbItem.name,
      amount: addedDbItem.amount,
      onShoppinglist: addedDbItem.onShoppinglist,
      id: addedDbItem.id,
    };

    return addedItem;
  }

  /**
   * GET items
   * @param database database to read items from
   * @returns list of read items
   */
  async getItems() {
    const table = await this.Item.findAll();
    const items: Item[] = [];
    table.forEach((item) => {
      items.push({
        name: item.name,
        amount: item.amount,
        onShoppinglist: item.onShoppinglist,
        id: item.id,
      });
    });
    return items;
  }

  /**
   * UPDATE item
   * @param item item to update
   * @param database database to update item in
   */
  async updateItem(id: number, item: Item) {
    await this.Item.update(
      {
        name: item.name,
        amount: item.amount,
        onShoppinglist: item.onShoppinglist,
      },
      { where: { id: id } }
    );

    return item;
  }

  /**
   * DELETE item
   * @param id id of item to delete
   * @param database database to delete item from
   */
  async deleteItem(id: number) {
    const deletedId = await this.Item.destroy({ where: { id: id } });
    return deletedId;
  }
}

class DbItem extends Model {
  name;
  amount;
  onShoppinglist;
  declare id: number;
}
