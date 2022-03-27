import { createReducer, on } from '@ngrx/store';
import { Item } from 'src/app/shared/item.model';
import {
  addItem,
  deleteItem,
  loadItems,
  loadItemsFailure,
  loadItemsSuccess as loadItemsSuccess,
  setEditingItem,
  setEditMode,
  startEditing,
  stopEditing,
  updateItem,
  updateItemFailure,
  updateItemId,
  updateItemSuccess,
} from './shopping-list.actions';

export interface ShoppingListState {
  items: Item[];
  editingItem: Item;
  editingMode: boolean;
  error: string;
  status: 'pending' | 'loading' | 'saving' | 'error' | 'success';
}

export const initialState: ShoppingListState = {
  items: [new Item('Apples', 5, 10, true), new Item('Tomato', 3, 11, true)],
  editingItem: null,
  editingMode: false,
  error: null,
  status: 'pending',
};

export const shoppingListReducer = createReducer(
  //supply initial state
  initialState,

  /**
   * Add
   */
  //add single Item
  on(addItem, (state, { item }) => ({
    ...state,
    items: [...state.items, item],
  })),

  /**
   * Update
   */
  //update single item by id
  on(updateItem, (state, { item }) => {
    //take copy of items
    const items = [...state.items];
    //get index of item to update
    const index = items.findIndex(obj => obj.id === item.id);
    //override old item with new item
    items[index] = item;
    return {
      ...state,
      items: items,
      status: 'saving',
    };
  }),

  //update id of single item
  on(updateItemId, (state, { oldId, newId }) => {
    //take copy of items
    const items = [...state.items];
    //get index of item to update
    const index = items.findIndex(obj => obj.id === oldId);
    //override old item with new item
    items[index].id = newId;
    return {
      ...state,
      items: items,
      status: 'saving',
    };
  }),
  on(updateItemSuccess, state => ({
    ...state,
    status: 'success',
  })),
  on(updateItemFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: 'error',
  })),

  /**
   * Edit
   */
  on(startEditing, (state, { item }) => ({
    ...state,
    editingMode: true,
    editingItem: item,
  })),
  on(stopEditing, state => ({
    ...state,
    editingMode: false,
  })),
  on(setEditingItem, (state, { item }) => ({
    ...state,
    editingItem: item,
  })),
  on(setEditMode, (state, { value }) => ({
    ...state,
    editingMode: value,
  })),

  /**
   * Delete
   */
  //delete single Item
  on(deleteItem, (state, { item }) => ({
    ...state,
    items: state.items.filter(it => it.id !== item.id),
  })),

  /**
   * Load
   */
  on(loadItems, state => ({
    ...state,
    status: 'loading',
  })),
  //loading of items from backend succeeded
  on(loadItemsSuccess, (state, { items }) => ({
    ...state,
    items: items,
    error: null,
    status: 'success',
  })),
  //loading of items from backend failed
  on(loadItemsFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: 'error',
  }))
);
