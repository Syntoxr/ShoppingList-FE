import { createAction, props } from '@ngrx/store';
import { Item } from 'src/app/shared/item.model';

/**
 * Add
 */
export const addItem = createAction(
  '[Shopping List] Add Item',
  props<{ item: Item }>()
);

/**
 * Update
 */
export const updateItem = createAction(
  '[Shopping List] Update Item',
  props<{ item: Item }>()
);

export const updateItemId = createAction(
  '[Shopping List] Update Item Id',
  props<{ oldId: number; newId: number }>()
);

export const updateItemSuccess = createAction(
  '[Shopping List] Update Item Success'
);

export const updateItemFailure = createAction(
  '[Shopping List] Update Item Failure',
  props<{ error: string }>()
);

/**
 * Edit
 */
export const startEditing = createAction(
  '[Shopping List] start Editing',
  props<{ item: Item }>()
);

export const stopEditing = createAction('[Shopping List] stop Editing');

export const setEditedItem = createAction(
  '[Shopping List] set Edited Item',
  props<{ item: Item }>()
);

export const setEditMode = createAction(
  '[Shopping List] Set Edit Mode',
  props<{ value: boolean }>()
);

/**
 * Delete
 */
export const deleteItem = createAction(
  '[Shopping List] Delete Item',
  props<{ item: Item }>()
);

/**
 * Load
 */
export const loadItems = createAction('[Shopping List] Load Items');

export const loadItemsSuccess = createAction(
  '[Shopping List] Load Items Success',
  props<{ items: Item[] }>()
);

export const loadItemsFailure = createAction(
  '[Shopping List] Load Items Failure',
  props<{ error: string }>()
);
