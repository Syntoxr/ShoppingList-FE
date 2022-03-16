import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

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


  constructor(private shoppingListService: ShoppingListService) {}

    ngOnInit(){
    this.items = this.shoppingListService.getItems();
    this.itemChangeSub =  this.shoppingListService.itemsUpdated.subscribe(
      (items: Item[]) => { this.items = items;}
    );
  }

  ngOnDestroy() {
    this.itemChangeSub.unsubscribe();
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);

  }

}
