import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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
  editForm: FormGroup;

  editingSubscription: Subscription;
  itemsSubscription: Subscription;
  editMode = false;
  editedItem: Item;
  items: Item[];

  constructor(private shoppingListService: ShoppingListService, private dataStorageService: DataStorageService) { }

  ngOnInit() {
    this.editForm = new FormGroup({ 
      'name': new FormControl(null, Validators.required), 
      'amount': new FormControl(1, Validators.required) 
    });

    this.editingSubscription = this.shoppingListService.startedEditing.subscribe(  //if Item is selected, fill form with values of selected item
      (id: number) => {
        this.editMode = true;
        this.editedItem = this.shoppingListService.getItem(id);
        this.editForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );

    this.itemsSubscription = this.shoppingListService.itemsUpdated.subscribe(items => this.items = items); //subscribe to item list. Required for Autocomplete
  }

  onSubmit(){
    const formValue = this.editForm.value;

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
    this.editForm.reset({amount: 1});
  }

  onDelete() {
    this.shoppingListService.removeItem(this.editedItem);
    this.clearForm();
  }

  ngOnDestroy(): void {
    this.editingSubscription.unsubscribe();
  }
  
}
