import { Injectable } from '@angular/core';
import { Item } from '../shared/item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  // get API endpoint URL from env file
  private readonly shoppinglistApiUrl = environment.apiEndpoints.shoppinglist;

  constructor(private http: HttpClient) {}

  // get all shopping list items from backend
  getItems() {
    return this.http.get<Item[]>(this.shoppinglistApiUrl);
  }

  //post new item with temporary id to backend.
  //Returns old- and new id in order to update the local temp id
  addItem(item: Item) {
    return this.http.post<{ oldId: number; newId: number }>(
      this.shoppinglistApiUrl,
      item
    );
  }

  //sends updated item to backend
  updateItem(item: Item) {
    return this.http.patch(this.shoppinglistApiUrl, item);
  }
}
