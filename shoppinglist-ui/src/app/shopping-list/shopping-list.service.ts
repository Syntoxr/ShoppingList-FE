import { Injectable } from '@angular/core';
import { Item, SocketResponse, SocketRooms } from '../shared/types';
import { Socket } from 'ngx-socket-io';
import { Store } from '@ngrx/store';
import {
  socketAddItem,
  socketDeleteItem,
  socketUpdateItem,
} from './store/shopping-list.actions';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  constructor(private socket: Socket, private store: Store) {}

  init() {
    console.log('initializing socket listeners for shoppinglist');
    // #region instant update listeners

    this.socket.on(SocketRooms.addItem, (data: { item: Item }) => {
      console.log(
        `recieved instant update: [${SocketRooms.addItem}] ${JSON.stringify(
          data
        )}`
      );
      this.store.dispatch(socketAddItem({ item: data.item }));
    });

    this.socket.on(SocketRooms.updateItem, (data: { item: Item }) => {
      console.log(
        `recieved instant update: [${SocketRooms.updateItem}] ${JSON.stringify(
          data
        )}`
      );
      this.store.dispatch(socketUpdateItem({ item: data.item }));
    });

    this.socket.on(SocketRooms.deleteItem, (data: { id: number }) => {
      console.log(
        `recieved instant update:  [${SocketRooms.deleteItem}] ${JSON.stringify(
          data
        )}`
      );
      this.store.dispatch(socketDeleteItem({ id: +data.id }));
    });

    // #endregion
  }

  // #region CRUD functions

  /**
   *
   * CRUD functions
   * (Socket event emitters)
   */

  //post new item with temporary id to backend.
  //Returns old- and new id in order to update the local temp id
  addItem(item: Item): Promise<Item | unknown> {
    console.log('ADD called');
    //return new promise, wich resoves when correct acknowledgment message is recieved
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('No socket connection.');
      } else {
        this.socket.emit(
          SocketRooms.addItem,
          { item: item },
          (response: SocketResponse) => {
            if (response.error) {
              console.error(response.error);
              reject(response.error);
            } else if (!response.body.newId || !response.body.oldId) {
              reject('recieved data not complete');
            } else {
              resolve(response.body);
            }
          }
        );
      }
    });
  }

  getItems(): Promise<Item[]> {
    console.log('GET called');
    //return new promise, wich resoves when correct acknowledgment message is recieved
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('No socket connection.');
      } else {
        this.socket.emit(
          SocketRooms.getItems,
          {},
          (response: SocketResponse) => {
            if (response.error) {
              console.error(response.error);
              reject(response.error);
            } else if (!Array.isArray(response.body)) {
              reject('recieved data not correct');
            } else {
              resolve(response.body);
            }
          }
        );
      }
    });
  }

  //sends updated item to backend
  updateItem(item: Item) {
    //return new promise, wich resoves when acknowledgment message is recieved
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('No socket connection.');
      } else {
        this.socket.emit(
          SocketRooms.updateItem,
          { item: item },
          (response: SocketResponse) => {
            if (response.error) {
              console.error(response.error);
              reject(response.error);
            } else {
              resolve(response.body);
            }
          }
        );
      }
    });
  }

  deleteItem(id: number) {
    //return new promise, wich resoves when acknowledgment message is recieved
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('No socket connection.');
      } else {
        this.socket.emit(
          SocketRooms.deleteItem,
          { id: id },
          (response: SocketResponse) => {
            if (response.error) {
              console.error(response.error);
              reject(response.error);
            } else {
              resolve(response.body);
            }
          }
        );
      }
    });
  }
  // #endregion
}
