export interface Item {
  name: string;
  amount: number;
  onShoppinglist: boolean;
  id: number;
}

export enum SocketRooms {
  addItem = "ADD_ITEM",
  getItems = "GET_ITEMS",
  updateItem = "UPDATE_ITEM",
  deleteItem = "DELETE_ITEM",
}

export interface CustomError {
  message: string;
  code: number;
  type?: string;
}

export interface SocketResponse {
  code: number;
  body?: unknown;
  error?: unknown;
}
