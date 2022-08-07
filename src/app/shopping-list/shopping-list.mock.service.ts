import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Item } from '../shared/types';
import { ShoppingListService } from './shopping-list.service';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ShoppingListMockService extends ShoppingListService {
  fakeBackendItems: Item[] = [
    { name: 'Apples', amount: 5, id: 1, onShoppinglist: true },
    { name: 'Bread', amount: 1, id: 2, onShoppinglist: false },
    { name: 'Cookies', amount: 1, id: 3, onShoppinglist: false },
    { name: 'Dragon fruit', amount: 2, id: 4, onShoppinglist: false },
    { name: 'Eggs', amount: 10, id: 5, onShoppinglist: false },
    { name: 'Flour', amount: 1, id: 6, onShoppinglist: false },
    { name: 'Green tea', amount: 1, id: 7, onShoppinglist: true },
    { name: 'Honey', amount: 3, id: 8, onShoppinglist: false },
    { name: 'Iceberg lettuce', amount: 1, id: 9, onShoppinglist: false },
    { name: 'Jack fruit', amount: 1, id: 10, onShoppinglist: false },
    { name: 'Kiwi', amount: 5, id: 11, onShoppinglist: false },
    { name: 'Lotion', amount: 1, id: 12, onShoppinglist: true },
    { name: 'Milk', amount: 100, id: 13, onShoppinglist: false },
    { name: 'Noodles', amount: 2, id: 14, onShoppinglist: false },
    { name: 'Oregano', amount: 1, id: 15, onShoppinglist: false },
    { name: 'Pepper', amount: 4, id: 16, onShoppinglist: true },
    { name: 'Quark', amount: 1, id: 17, onShoppinglist: false },
    { name: 'Radishes', amount: 1, id: 18, onShoppinglist: false },
    { name: 'Soap', amount: 1, id: 19, onShoppinglist: false },
    { name: 'Toilet paper', amount: 20, id: 2, onShoppinglist: false },
    { name: 'Unicorn', amount: 1, id: 21, onShoppinglist: false },
    { name: 'Vinegar', amount: 1, id: 22, onShoppinglist: true },
    { name: 'Watermelon', amount: 1, id: 23, onShoppinglist: false },
    { name: 'Xylitol', amount: 2, id: 24, onShoppinglist: false },
    { name: 'Yogurt', amount: 3, id: 25, onShoppinglist: false },
    { name: 'Zucchini', amount: 1, id: 26, onShoppinglist: false },
  ];

  delay = 500; //response delay in ms

  constructor() {
    super(undefined, undefined);
  }

  getRandomId() {
    return Date.now() * Math.floor(Math.random() * 99);
  }

  override init() {}
  //post new item with temporary id to backend.
  //Returns old- and new id in order to update the local temp id
  override addItem(item: Item) {
    const itemCopy: Item = JSON.parse(JSON.stringify(item));
    const oldId = itemCopy.id;
    const newId = this.getRandomId();
    itemCopy.id = newId;
    const newId$ = of({ oldId: oldId, newId: newId }).pipe(delay(this.delay));

    console.info('%c Add item message would be sent', 'color: green');

    return new Promise<{ newId: number; oldId: number }>(resolve =>
      setTimeout(() => resolve({ oldId: oldId, newId: newId }), this.delay)
    );
  }

  // get all shopping list items from backend
  override getItems() {
    console.info('%c Get items message would be sent', 'color: green');
    return new Promise<Item[]>(resolve =>
      setTimeout(() => resolve(this.fakeBackendItems), this.delay)
    );
  }

  //sends updated item to backend
  override updateItem(item: Item) {
    console.info('%c Update item message would be sent', 'color: green');
    return new Promise(resolve => setTimeout(() => resolve(null), this.delay));
  }

  override deleteItem(id: number) {
    console.info('%c Delete item message would be sent', 'color: green');
    return new Promise(resolve => setTimeout(() => resolve(null), this.delay));
  }
}
