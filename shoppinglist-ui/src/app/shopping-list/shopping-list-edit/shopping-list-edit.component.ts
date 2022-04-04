import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { first, Observable, Subscription, take } from 'rxjs';
import { equalizeString } from 'src/app/shared/helper-functions';
import { Item } from 'src/app/shared/types';
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
  selectItemByName,
} from '../store/shopping-list.selectors';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.less'],
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild('amount') amountInputElement: ElementRef;
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
      amount: new FormControl(null),
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
    let formAmount = this.editForm.value.amount;
    const formName = this.editForm.value.name;

    if (typeof formAmount !== 'number') {
      formAmount = 1;
    }

    //look if edit mode is activated
    let editMode: boolean;
    this.editMode.pipe(first()).subscribe(mode => (editMode = mode));

    //when edit mode is active update according item
    if (editMode) {
      const updatedItem = {
        name: formName,
        amount: formAmount,
        id: this.editedItem.id,
        onShoppinglist: true,
      };
      this.store.dispatch(updateItem({ item: updatedItem }));
    } else {
      //check if name of item already exists in list
      const nameExists: boolean =
        this.items.filter(
          item => equalizeString(item.name) === equalizeString(formName)
        ).length !== 0;

      //update item if already exists
      if (nameExists) {
        //get item by name from store
        this.store
          .select(selectItemByName(formName))
          .pipe(first())
          .subscribe(selectedItem => {
            const updatedItem: Item = JSON.parse(JSON.stringify(selectedItem));
            //add submitted amount to item
            updatedItem.amount = updatedItem.amount + formAmount;
            updatedItem.onShoppinglist = true;

            //dispatch updated item to store
            this.store.dispatch(updateItem({ item: updatedItem }));
          });

        //add item if it does not exists
      } else {
        //build new item
        const newItem = {
          name: formName,
          amount: formAmount,
          id: Date.now(),
          onShoppinglist: true,
        };
        //dispath new item to store
        this.store.dispatch(addItem({ item: newItem }));
      }
    }
    this.clearForm();
  }

  onSelectSuggestion(item: Item) {
    this.store.dispatch(setEditMode({ value: item.onShoppinglist })); //set edit mode true if item already on shoppinglist
    this.store.dispatch(setEditedItem({ item }));

    //set form to selected item from suggestions
    this.editForm.setValue({
      name: this.editedItem.name,
      amount: this.editedItem.amount,
    });
    this.showSelectDropdown = false;
  }

  addAmount() {
    this.editForm.controls['amount'].patchValue(
      this.editForm.controls['amount'].value + 1
    );
  }

  substractAmount() {
    const currentValue = this.editForm.controls['amount'].value;
    if (currentValue === 1) {
      return;
    }
    this.editForm.controls['amount'].patchValue(currentValue - 1);
  }

  clearForm() {
    this.store.dispatch(setEditMode({ value: false }));
    this.editForm.reset();
    this.amountInputElement.nativeElement.blur();
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
        return equalizeString(item.name).includes(
          equalizeString(this.editForm.controls['name'].value)
        );
      });
    }
  }

  ngOnDestroy(): void {
    this.itemsSub$.unsubscribe();
    this.editedItemSub$.unsubscribe();
  }
}
