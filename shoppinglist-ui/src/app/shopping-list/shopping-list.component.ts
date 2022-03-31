import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Item } from '../shared/item.model';
import {
  loadItems,
  startEditing,
  toggleSortOrder,
  updateItem,
} from './store/shopping-list.actions';
import {
  selectAllItems,
  selectSortOrder,
} from './store/shopping-list.selectors';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.less'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  items: Item[];
  sortOrder$: Observable<string>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadItems());
    this.sortOrder$ = this.store.select(selectSortOrder);
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

  onTogleSorting() {
    this.store.dispatch(toggleSortOrder());
  }

  ngOnDestroy(): void {
    this.sortOrder$.subscribe();
  }
}
