import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Item } from 'src/app/shared/types';
import { deleteItem, updateItem } from '../store/shopping-list.actions';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.less'],
})
export class EditItemComponent implements OnInit {
  @Input() editItem: Item;
  @Output() close = new EventEmitter<void>();
  editForm: UntypedFormGroup;

  constructor(private store: Store) {}

  ngOnInit(): void {
    // prepare edit form
    this.editForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.editItem.name, Validators.required),
      amount: new UntypedFormControl(this.editItem.amount),
      id: new UntypedFormControl(this.editItem.id),
    });
  }

  onCancel() {
    this.close.emit();
  }

  onDelete() {
    this.store.dispatch(deleteItem({ item: this.editItem }));
    this.close.emit();
  }

  onSubmit() {
    //close if nothing entered
    if (!this.editForm.dirty) {
      this.close.emit();
      return;
    }
    //get values from form
    let formAmount = this.editForm.value.amount;
    const formName = this.editForm.value.name;
    const id = this.editForm.value.id;

    if (typeof formAmount !== 'number') {
      formAmount = 1;
    }

    const updatedItem = {
      name: formName,
      amount: formAmount,
      id: id,
      onShoppinglist: true,
    };
    this.store.dispatch(updateItem({ item: updatedItem }));
    this.editForm.reset();
    this.close.emit();
  }

  //add 1 to current amount on button press
  addAmount() {
    this.editForm.controls['amount'].markAsDirty();
    this.editForm.controls['amount'].patchValue(
      this.editForm.controls['amount'].value + 1
    );
  }

  //substract amount by on on button press
  substractAmount() {
    this.editForm.controls['amount'].markAsDirty();
    const currentValue = this.editForm.controls['amount'].value;
    if (currentValue === 1) {
      return;
    }
    this.editForm.controls['amount'].patchValue(currentValue - 1);
  }
}
