import { Injectable } from '@angular/core';
import { Item } from '../shared/types';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  constructor(private http: HttpClient) {}

  private readonly shoppinglistApiUrl = '/api/shoppingList/';

  //post new item with temporary id to backend.
  //Returns old- and new id in order to update the local temp id
  addItem(item: Item) {
    return this.http.post<{ oldId: number; newId: number }>(
      this.shoppinglistApiUrl + 'item/',
      item
    );
  }

  // get all shopping list items from backend
  getItems() {
    return this.http.get<Item[]>(this.shoppinglistApiUrl + 'items/');
  }

  //sends updated item to backend
  updateItem(item: Item) {
    return this.http.patch(this.shoppinglistApiUrl + 'item/' + item.id, item);
  }

  deleteItem(item: Item) {
    return this.http.delete(this.shoppinglistApiUrl + 'item/' + item.id);
  }
}
