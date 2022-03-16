import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Item } from "../shared/item.model";

@Injectable({providedIn: 'root'})

export class ShoppingListService {
    itemsUpdated = new Subject<Item[]>();
    startedEditing = new Subject<number>();


    private items: Item[] = [
        new Item ('Apples', 5, 10),
        new Item ('Tomato', 3, 11)
      ];

    getItems() {
        return this.items.slice();
    }


    private addAndMergeItem(item: Item) {
        let duplicate= false;
        this.items.find((o ,i) => {
            if (o.name === item.name) {
                this.items[i].amount = +this.items[i].amount + +item.amount;
                duplicate = true;
            }})

        if (duplicate === false){
              this.items.push(item);
           }
    }

    addItem(item: Item) {
        this.addAndMergeItem(item);
        this.itemsUpdated.next(this.items.slice());
    }

    addItems(items: Item[]){
        items.forEach(item => {this.addAndMergeItem(item)});
        this.itemsUpdated.next(this.items.slice());
    }

    getItem(index: number) {
        return this.items[index];
    }

    removeItem(index: number) {
        this.items.splice(index, 1);
        this.itemsUpdated.next(this.items.slice());
    }

    updateItem(index: number, item: Item) {
        this.items[index] = item;
        this.itemsUpdated.next(this.items.slice());
    }
}
