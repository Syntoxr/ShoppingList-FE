export interface Item {
  name: string;
  amount: number;
  id: number;
  onShoppinglist: boolean;
}

export enum SocketRooms {
  addItem = 'ADD_ITEM',
  getItems = 'GET_ITEMS',
  updateItem = 'UPDATE_ITEM',
  deleteItem = 'DELETE_ITEM',
}

export interface SocketResponse {
  code: number;
  body?: any;
  error?: any;
}

export interface Category {
  name: string;
  color: string;
  icon?: string;
  id: number;
}
