import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';

import { Item } from '../shared/item.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.less']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  private itemChangeSub: Subscription;


  constructor(private shoppingListService: ShoppingListService, private dataStorageService: DataStorageService) {}

    ngOnInit(){
    this.dataStorageService.fetchItems();
    this.items = this.shoppingListService.getItems();
    this.itemChangeSub =  this.shoppingListService.itemsUpdated.subscribe(
      (items: Item[]) => { this.items = items;}
    );
  }

  ngOnDestroy() {
    this.itemChangeSub.unsubscribe();
  }

  onEditItem(id: number) {
    this.shoppingListService.startedEditing.next(id);
  }

  onCheckItem(item: Item) {
    const updatedItem = item;
    updatedItem.visible = false;
    this.shoppingListService.updateItem(updatedItem)
  }

}
