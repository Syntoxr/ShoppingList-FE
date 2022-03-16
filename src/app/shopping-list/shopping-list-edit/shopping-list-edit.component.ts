import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/shared/item.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.less']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;

  editingSubscription: Subscription
  editMode = false;
  editedItemIndex: number;
  editedItem: Item;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.editingSubscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getItem(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  onSubmit(form: NgForm){
    const value = form.value;
    const item = new Item(value.name, value.amount)
    if (this.editMode) {
      this.shoppingListService.updateItem(this.editedItemIndex, item)
    } else {
      this.shoppingListService.addItem(item);
    }   
    this.clearForm();
    
  }

  clearForm() {
    this.editMode = false;
    this.slForm.reset({amount: 1});
  }

  onDelete() {
    this.shoppingListService.removeItem(this.editedItemIndex);
    this.clearForm();
  }

  ngOnDestroy(): void {
    this.editingSubscription.unsubscribe();
  }
  
}
