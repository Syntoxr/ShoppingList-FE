import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Item } from '../shared/item.model';
import {
  loadItems,
  startEditing,
  updateItem,
} from './store/shopping-list.actions';
import { selectAllItems } from './store/shopping-list.selectors';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.less'],
})
export class ShoppingListComponent implements OnInit {
  items: Item[];

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadItems());
    this.store.select(selectAllItems).subscribe(items => {
      this.items = items;
    });
  }

  onEditItem(item: Item) {
    this.store.dispatch(startEditing({ item: item }));
  }

  onCheckItem(item: Item) {
    const updatedItem: Item = JSON.parse(JSON.stringify(item));
    updatedItem.visible = false;
    updatedItem.amount = 1;
    this.store.dispatch(updateItem({ item: updatedItem }));
  }
}
