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


    getItem(id: number) {
        const index = this.items.findIndex(obj => obj.id === id);
        return this.items[index];
    }

    getItems() {
        return this.items.slice();
    }



    addItem(item: Item) {
        const index = this.items.findIndex(obj => obj.name === item.name); //get index of item with name item.name
        if (index === -1) {  //if Item does not exist
            this.items.push(item);
            this.itemsUpdated.next(this.items.slice());
        } else { //if item exists -> update item
            this.updateItem(item);
        }
        
    }

    addItems(items: Item[]){
        items.forEach(item => {
            const index = this.items.findIndex(obj => obj.name === item.name); //get index of item with name item.name
            if (index === -1) {  //if Item does not exist
                this.items.push(item);
                this.itemsUpdated.next(this.items.slice());
            } else { //if item exists -> update item
                this.updateItem(item);
            }
        });
        this.itemsUpdated.next(this.items.slice());
    }


    
    removeItem(item: Item) {
        const index = this.getItemIndex(item);
        this.items.splice(index, 1);

        this.itemsUpdated.next(this.items.slice());
    }

    updateItem(item: Item) {
        const index = this.getItemIndex(item);
        this.items[index] = item

        this.itemsUpdated.next(this.items.slice());
    }



    private getItemIndex(item: Item) {
        return this.items.findIndex(obj => obj.id === item.id);
    }
}
