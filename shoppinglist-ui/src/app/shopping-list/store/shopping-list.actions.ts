import { createAction, props } from '@ngrx/store';
import { Item } from 'src/app/shared/types';

/**
 *
 * Add
 *
 */
export const addItem = createAction(
  '[Shopping List] Add item',
  props<{ item: Item }>()
);

export const socketAddItem = createAction(
  '[Shopping List] Socket Add item',
  props<{ item: Item }>()
);

export const addItemSuccess = createAction(
  '[Shopping List] Add item success',
  props<{ oldId: number; newId: number }>()
);

export const addItemFailure = createAction(
  '[Shopping List] Add item failure',
  props<{ error: string }>()
);

/**
 *
 * Update
 *
 */
export const updateItem = createAction(
  '[Shopping List] Update item',
  props<{ item: Item }>()
);

export const socketUpdateItem = createAction(
  '[Shopping List] Socket Update item',
  props<{ item: Item }>()
);

export const updateItemSuccess = createAction(
  '[Shopping List] Update item success'
);

export const updateItemFailure = createAction(
  '[Shopping List] Update item failure',
  props<{ error: string }>()
);

/**
 *
 * Delete
 *
 */
export const deleteItem = createAction(
  '[Shopping List] Delete item',
  props<{ item: Item }>()
);

export const socketDeleteItem = createAction(
  '[Shopping List] Socket delete item',
  props<{ id: number }>()
);

export const deleteItemSuccess = createAction(
  '[Shopping List] Delete item success'
);

export const deleteItemFailure = createAction(
  '[Shopping List] Delete item failure',
  props<{ error: string }>()
);

/**
 *
 * Load
 *
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
 *
 * Other
 *
 */
export const toggleSortOrder = createAction(
  '[Shopping List] Toggle sort order'
);

export const sortList = createAction('[Shopping List] Sort list');
