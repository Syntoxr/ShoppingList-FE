import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  suggestetItems: Item[] = [];
  showSelectDropdown = false;

  constructor(private shoppingListService: ShoppingListService, private dataStorageService: DataStorageService, private renderer: Renderer2) { }

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
    
    this.items = this.shoppingListService.getItems(); //get item list and subscribe afterwards. Required for Autocomplete
    this.itemsSubscription = this.shoppingListService.itemsUpdated.subscribe(items => this.items = items); 
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

  onSelectSuggestion(item: Item) {
    this.editMode = true;
    this.editedItem = item;
    this.editForm.setValue({
      name: this.editedItem.name,
      amount: this.editedItem.amount
    });
    this.showSelectDropdown = false;
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
  
  onTypeName() {
    console.log(this.showSelectDropdown);
    this.suggestetItems = this.items.filter( item => { //compare searchstring with item names caseinsensitive and ignoring accents
      return item.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleUpperCase()
        .includes(this.editForm.controls['name'].value
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, "")
          .toLocaleUpperCase())
    });
    if (this.suggestetItems.length > 0) {this.showSelectDropdown = true}
  }
}
