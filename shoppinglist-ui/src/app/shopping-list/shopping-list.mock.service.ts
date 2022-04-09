import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Item } from '../shared/types';
import { ShoppingListService } from './shopping-list.service';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ShoppingListMockService extends ShoppingListService {
  fakeBackendItems: Item[] = [
    { name: 'Äpfel', amount: 5, id: 1, onShoppinglist: true },
    { name: 'Brot', amount: 1, id: 2, onShoppinglist: false },
    { name: 'Cookies', amount: 1, id: 3, onShoppinglist: false },
    { name: 'Drachenfrucht', amount: 2, id: 4, onShoppinglist: false },
    { name: 'Eier', amount: 10, id: 5, onShoppinglist: false },
    { name: 'Feldsalat', amount: 1, id: 6, onShoppinglist: false },
    { name: 'Grüner Tee', amount: 1, id: 7, onShoppinglist: true },
    { name: 'Hefe', amount: 3, id: 8, onShoppinglist: false },
    { name: 'Ingwer', amount: 1, id: 9, onShoppinglist: false },
    { name: 'Jackfruit', amount: 1, id: 10, onShoppinglist: false },
    { name: 'Kiwi', amount: 5, id: 11, onShoppinglist: false },
    { name: 'Lotion', amount: 1, id: 12, onShoppinglist: true },
    { name: 'Milch', amount: 100, id: 13, onShoppinglist: false },
    { name: 'Nudeln', amount: 2, id: 14, onShoppinglist: false },
    { name: 'Oregano', amount: 1, id: 15, onShoppinglist: false },
    { name: 'Paprika', amount: 4, id: 16, onShoppinglist: true },
    { name: 'Quark', amount: 1, id: 17, onShoppinglist: false },
    { name: 'Radischen', amount: 1, id: 18, onShoppinglist: false },
    { name: 'Sahne', amount: 1, id: 19, onShoppinglist: false },
    { name: 'Toilettenpapier', amount: 20, id: 2, onShoppinglist: false },
    { name: 'Unicorn', amount: 1, id: 21, onShoppinglist: false },
    { name: 'Vanillezucker', amount: 1, id: 22, onShoppinglist: true },
    { name: 'Wildlachs', amount: 1, id: 23, onShoppinglist: false },
    { name: 'Xylit', amount: 2, id: 24, onShoppinglist: false },
    { name: 'Yackbraten', amount: 3, id: 25, onShoppinglist: false },
    { name: 'Zitronen', amount: 1, id: 26, onShoppinglist: false },
  ];

  delay = 500; //response delay in ms

  getRandomId() {
    return Date.now() * Math.floor(Math.random() * 99);
  }

  //post new item with temporary id to backend.
  //Returns old- and new id in order to update the local temp id
  override addItem(item: Item) {
    const itemCopy: Item = JSON.parse(JSON.stringify(item));
    const oldId = itemCopy.id;
    const newId = this.getRandomId();
    itemCopy.id = newId;
    const newId$ = of({ oldId: oldId, newId: newId }).pipe(delay(this.delay));

    console.info(
      '%c Add item [POST] http request would be sent',
      'color: green'
    );
    return newId$;
  }

  // get all shopping list items from backend
  override getItems() {
    const items$ = of(this.fakeBackendItems).pipe(delay(this.delay));

    console.info(
      '%c Get items [GET] http request would be sent',
      'color: green'
    );
    return items$;
  }

  //sends updated item to backend
  override updateItem(item: Item) {
    const response$ = of(null).pipe(delay(this.delay));

    console.info(
      '%c Update item [PATCH] http request would be sent',
      'color: green'
    );
    return response$;
  }

  override deleteItem(item: Item) {
    const response$ = of(null).pipe(delay(this.delay));

    console.info(
      '%c Delete item [DELETE] http request would be sent',
      'color: green'
    );
    return response$;
  }
}
