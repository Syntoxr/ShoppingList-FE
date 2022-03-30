import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { first, Observable, Subscription, take } from 'rxjs';
import { Item } from 'src/app/shared/item.model';
import {
  addItem,
  deleteItem,
  setEditedItem,
  setEditMode,
  updateItem,
} from '../store/shopping-list.actions';
import {
  selectAllItems,
  selectEditedItem,
  selectEditingMode,
} from '../store/shopping-list.selectors';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.less'],
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  editForm: FormGroup;

  editMode: Observable<boolean>;
  editedItem: Item;
  items: Item[] = [];
  suggestedItems: Item[] = [];
  showSelectDropdown = false;
  itemsSub$: Subscription;
  editedItemSub$: Subscription;
  constructor(private store: Store) {}

  ngOnInit() {
    //create new reactive form with validators
    this.editForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(1, Validators.required),
    });

    //assign observable containing the item list to this.items
    this.itemsSub$ = this.store
      .select(selectAllItems)
      .subscribe(items => (this.items = items)); //subscribe to item list. Required for Autocomplete

    //subscribe to editedItem from store and update this.editedItem accordingly
    this.editedItemSub$ = this.store
      .select(selectEditedItem)
      .subscribe(item => {
        this.editedItem = item;
        if (item !== null) {
          this.editForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
          });
        }
      });

    //assign observable containing the edit Mode list to this.editMode
    this.editMode = this.store.select(selectEditingMode);
  }

  onSubmit() {
    //get values from form
    const formValue = this.editForm.value;

    //look if edit mode is activated
    let editMode: boolean;
    this.editMode.pipe(first()).subscribe(mode => (editMode = mode));

    //when edit mode is active update according item
    if (editMode) {
      const updatedItem = new Item(
        formValue.name,
        formValue.amount,
        this.editedItem.id,
        true
      );
      this.store.dispatch(updateItem({ item: updatedItem }));
      //when not in edit mode add item
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
    this.store.dispatch(setEditedItem({ item }));

    //set form to selected item from suggestions
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

  //every time a letter is typed in name field
  onTypeName() {
    this.updateSuggestions();
    if (this.suggestedItems.length > 0) {
      this.showSelectDropdown = true;
    }
  }

  updateSuggestions() {
    if (this.editForm.controls['name'].value) {
      this.suggestedItems = this.items.filter(item => {
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
      console.log(this.suggestedItems);
    }
  }

  ngOnDestroy(): void {
    this.itemsSub$.unsubscribe();
    this.editedItemSub$.unsubscribe();
  }
}

//dropdown doesn't get displayed
