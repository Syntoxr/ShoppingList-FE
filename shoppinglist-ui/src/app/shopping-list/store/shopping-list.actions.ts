import { createAction, props } from '@ngrx/store';
import { Item } from 'src/app/shared/types';

/**
 * Add
 */
export const addItem = createAction(
  '[Shopping List] Add item',
  props<{ item: Item }>()
);

/**
 * Update
 */
export const updateItem = createAction(
  '[Shopping List] Update item',
  props<{ item: Item }>()
);

export const updateItemId = createAction(
  '[Shopping List] Update item id',
  props<{ oldId: number; newId: number }>()
);

export const updateItemSuccess = createAction(
  '[Shopping List] Update item success'
);

export const updateItemFailure = createAction(
  '[Shopping List] Update item failure',
  props<{ error: string }>()
);

/**
 * Edit
 */
export const startEditing = createAction(
  '[Shopping List] start editing',
  props<{ item: Item }>()
);

export const stopEditing = createAction('[Shopping List] stop Editing');

export const setEditedItem = createAction(
  '[Shopping List] set edited item',
  props<{ item: Item }>()
);

export const setEditMode = createAction(
  '[Shopping List] Set edit mode',
  props<{ value: boolean }>()
);

/**
 * Delete
 */
export const deleteItem = createAction(
  '[Shopping List] Delete item',
  props<{ item: Item }>()
);

/**
 * Load
 */
export const loadItems = createAction('[Shopping List] Load Items');

export const loadItemsSuccess = createAction(
  '[Shopping List] Load items success',
  props<{ items: Item[] }>()
);

export const loadItemsFailure = createAction(
  '[Shopping List] Load items failure',
  props<{ error: string }>()
);

/**
 * Other
 */
export const toggleSortOrder = createAction(
  '[Shopping List] Toggle sort order'
);

export const sortList = createAction('[Shopping List] Sort list');
