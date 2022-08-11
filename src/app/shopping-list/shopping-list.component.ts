import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';

import { Item } from '../shared/types';
import {
  loadItems,
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
  shoppingItems$ = new BehaviorSubject<Item[]>([]);
  sortOrder$: Observable<string>;
  editItem: Item;
  showEdit = false;

  constructor(private store: Store) {}

  ngOnInit() {
    this.sortOrder$ = this.store.select(selectSortOrder);
    this.store.select(selectAllItems).subscribe(items => {
      this.shoppingItems$.next(items.filter(item => item.onShoppinglist));
    });
  }

  onCheckItem(item: Item) {
    const updatedItem: Item = JSON.parse(JSON.stringify(item));
    updatedItem.onShoppinglist = false;
    updatedItem.amount = 1;
    this.store.dispatch(updateItem({ item: updatedItem }));
  }

  onEditItem(item: Item) {
    this.editItem = item;
    this.showEdit = true;
  }

  onTogleSorting() {
    this.store.dispatch(toggleSortOrder());
  }

  ngOnDestroy(): void {
    this.sortOrder$.subscribe();
  }
}
