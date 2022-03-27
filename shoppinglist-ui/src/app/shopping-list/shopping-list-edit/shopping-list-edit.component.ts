import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { first, Observable, Subscription } from 'rxjs';
import { Item } from 'src/app/shared/item.model';
import {
  addItem,
  deleteItem,
  setEditingItem,
  setEditMode,
  updateItem,
} from '../store/shopping-list.actions';
import {
  selectAllItems,
  selectEditingItem,
  selectEditingMode,
} from '../store/shopping-list.selectors';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.less'],
})
export class ShoppingListEditComponent implements OnInit {
  editForm: FormGroup;

  itemsSubscription: Subscription;
  editMode: Observable<boolean>;
  editedItem: Item;
  items: Observable<Item[]>;
  suggestedItems: Item[] = [];
  showSelectDropdown = false;

  constructor(private store: Store) {}

  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(1, Validators.required),
    });

    this.items = this.store.select(selectAllItems); //subscribe to item list. Required for Autocomplete

    this.store.select(selectEditingItem).subscribe(item => {
      this.editedItem = item;
      if (item !== null) {
        this.editForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    });

    this.editMode = this.store.select(selectEditingMode);
  }

  onSubmit() {
    const formValue = this.editForm.value;
    let editMode: boolean;

    this.store
      .select(selectEditingMode)
      .pipe(first())
      .subscribe(mode => {
        editMode = mode;
      });

    if (editMode) {
      const updatedItem = new Item(
        formValue.name,
        formValue.amount,
        this.editedItem.id,
        true
      );
      this.store.dispatch(updateItem({ item: updatedItem }));
    } else {
      const newItem = new Item(
        formValue.name,
        formValue.amount,
        Date.now(),
        true
      );
      this.store.dispatch(addItem({ item: newItem }));
    }
    this.clearForm();
  }

  onSelectSuggestion(item: Item) {
    this.store.dispatch(setEditMode({ value: item.visible }));
    this.store.dispatch(setEditingItem({ item }));

    this.editForm.setValue({
      name: this.editedItem.name,
      amount: this.editedItem.amount,
    });
    this.showSelectDropdown = false;
  }

  clearForm() {
    this.store.dispatch(setEditMode({ value: false }));
    this.editForm.reset({ amount: 1 });
  }

  onDelete() {
    this.store.dispatch(deleteItem({ item: this.editedItem }));
    this.clearForm();
  }

  onTypeName() {
    this.updateSuggestions();
    if (this.suggestedItems.length > 0) {
      this.showSelectDropdown = true;
    }
  }

  updateSuggestions() {
    let searchItems: Item[];
    //get items from store
    this.store
      .select(selectAllItems)
      .pipe(first())
      .subscribe(items => {
        searchItems = items;
      });

    if (this.editForm.controls['name'].value) {
      let searchItems: Item[];
      //get items from store
      this.store
        .select(selectAllItems)
        .pipe(first())
        .subscribe(items => {
          searchItems = items;
        });

      this.suggestedItems = searchItems.filter(item => {
        //compare searchstring with item names caseinsensitive and ignoring accents
        return item.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLocaleUpperCase()
          .includes(
            this.editForm.controls['name'].value
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLocaleUpperCase()
          );
      });
    }
  }
}
