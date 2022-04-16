import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzOptionSelectionChange } from 'ng-zorro-antd/auto-complete';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { equalizeString } from 'src/app/shared/helper-functions';
import { Item } from 'src/app/shared/types';
import { addItem, updateItem } from '../store/shopping-list.actions';
import { selectAllItems } from '../store/shopping-list.selectors';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.less'],
})
export class AddItemComponent implements OnInit, OnDestroy {
  addForm: FormGroup;

  items: Item[] = [];
  suggestedItems: Item[] = [];
  shoppingItems: Item[] = [];
  showSelectDropdown = false;

  itemsSub$: Subscription;

  constructor(private store: Store, private modal: NzModalService) {}

  ngOnInit(): void {
    //create new reactive form with validators
    this.addForm = new FormGroup({
      name: new FormControl(null, Validators.required),
    });

    //assign observable containing the item list to this.items
    this.itemsSub$ = this.store.select(selectAllItems).subscribe(items => {
      this.items = items;
      this.shoppingItems = items.filter(item => item.onShoppinglist);
    });
  }

  onSubmit() {
    //get name from form
    const name: string = this.addForm.controls['name'].value;

    //check if name already exists on whole list
    const itemInList = this.nameInList(this.items, name);
    if (itemInList) {
      //check if name already exists on shopping list
      const itemInShoppinglist = this.nameInList(this.shoppingItems, name);
      if (itemInShoppinglist) {
        this.displayItemAlreadyInShoppinglist(itemInShoppinglist);
        this.clearForm();
        return;
      }

      const updatedItem: Item = {
        name: name,
        amount: 1,
        id: itemInList.id,
        onShoppinglist: true,
      };

      this.store.dispatch(updateItem({ item: updatedItem }));
      this.clearForm();
      return;
    }

    // add item to list if it doesn't exist in wholw list
    const newItem: Item = {
      name: name,
      amount: 1,
      id: Date.now(), //set temporary id
      onShoppinglist: true,
    };
    //dispath new item to store
    this.store.dispatch(addItem({ item: newItem }));
    this.clearForm();
  }

  onSelectionChange(event: NzOptionSelectionChange, item: Item) {
    //return if item not selected through click or enter
    if (!event.isUserInput) {
      return;
    }

    //if item already on shoppinglist
    if (this.shoppingItems.includes(item)) {
      this.displayItemAlreadyInShoppinglist(item);
      this.clearForm();
      return;
    }

    //build updated Item
    const updatedItem: Item = {
      ...item,
      amount: 1,
      onShoppinglist: true,
    };

    //dispatch updated item
    this.store.dispatch(updateItem({ item: updatedItem }));

    this.showSelectDropdown = false;
    this.clearForm();
  }

  //every time a letter is typed in name field
  onType() {
    this.updateSuggestions();
    if (this.suggestedItems.length > 0) {
      this.showSelectDropdown = true;
    }
  }

  updateSuggestions() {
    if (this.addForm.controls['name'].value) {
      this.suggestedItems = this.items.filter(item => {
        //compare searchstring with item names caseinsensitive and ignoring accents
        return equalizeString(item.name).includes(
          equalizeString(this.addForm.controls['name'].value)
        );
      });
    }
  }

  displayItemAlreadyInShoppinglist(item: Item) {
    this.modal.create({
      nzTitle: 'Bereits auf der Liste',
      nzContent:
        'Das befindet sich bereits auf der Liste. \n Möchtest du die Anzahl um 1 erhöhen oder nichts tun?',
      nzFooter: [
        {
          label: '+1',
          type: 'primary',
          onClick: () => {
            const updatedItem: Item = {
              ...item,
              amount: item.amount + 1,
            };
            this.store.dispatch(updateItem({ item: updatedItem }));
            this.modal.closeAll();
            this.clearForm();
          },
        },
        {
          label: 'Nichts',
          type: 'primary',
          onClick: () => {
            this.modal.closeAll();
            this.clearForm();
          },
        },
      ],
    });
  }

  private nameInList(list: Item[], name: string) {
    return list.find(item => {
      return equalizeString(item.name) === equalizeString(name);
    });
  }

  clearForm() {
    this.addForm.reset();
    this.suggestedItems = [];
  }

  ngOnDestroy(): void {
    this.itemsSub$.unsubscribe();
  }
}
