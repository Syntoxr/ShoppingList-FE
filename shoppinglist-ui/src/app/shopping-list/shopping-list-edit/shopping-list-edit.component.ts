import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
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
  editedItem: Item;

  constructor(private shoppingListService: ShoppingListService, private dataStorageService: DataStorageService) { }

  ngOnInit() {
    this.editingSubscription = this.shoppingListService.startedEditing.subscribe(
      (id: number) => {
        this.editMode = true;
        this.editedItem = this.shoppingListService.getItem(id);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  onSubmit(form: NgForm){
    const formValue = form.value;

    if (this.editMode) {
      const updatedItem = new Item(formValue.name, formValue.amount, this.editedItem.id, true)
      this.shoppingListService.updateItem(updatedItem)
    } else {
      const newItem = new Item(formValue.name, formValue.amount, Date.now(), true)
      this.shoppingListService.addItem(newItem);
      this.dataStorageService.addItem(newItem)
    }   
    this.clearForm();
    
  }

  clearForm() {
    this.editMode = false;
    this.slForm.reset({amount: 1});
  }

  onDelete() {
    this.shoppingListService.removeItem(this.editedItem);
    this.clearForm();
  }

  ngOnDestroy(): void {
    this.editingSubscription.unsubscribe();
  }
  
}
