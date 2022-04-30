import { createReducer, on } from '@ngrx/store';
import { equalizeString } from 'src/app/shared/helper-functions';
import { Item } from 'src/app/shared/types';
import {
  addItem,
  addItemFailure,
  addItemSuccess,
  deleteItem,
  deleteItemFailure,
  deleteItemSuccess,
  loadItems,
  loadItemsFailure,
  loadItemsSuccess as loadItemsSuccess,
  socketAddItem,
  socketDeleteItem,
  socketUpdateItem,
  sortList,
  toggleSortOrder,
  updateItem,
  updateItemFailure,
  updateItemSuccess,
} from './shopping-list.actions';

export interface ShoppingListState {
  items: Item[];
  sortOrder: 'ascending' | 'decending';
  error: string;
  status: 'pending' | 'loading' | 'saving' | 'error' | 'success';
}

export const initialState: ShoppingListState = {
  items: [],
  sortOrder: 'ascending',
  error: null,
  status: 'pending',
};

export const shoppingListReducer = createReducer(
  //supply initial state
  initialState,

  /**
   *
   * Add
   *
   */
  //add single Item
  on(addItem, (state, { item }) => ({
    ...state,
    items: [...state.items, item],
    status: 'saving',
  })),

  on(socketAddItem, (state, { item }) => ({
    ...state,
    items: [...state.items, item],
  })),

  on(addItemSuccess, (state, { oldId, newId }) => {
    //take copy of items
    const items: Item[] = JSON.parse(JSON.stringify(state.items));
    //get index of item to update
    const index = items.findIndex(obj => obj.id === oldId);
    //override old item with new item
    items[index].id = newId;
    return {
      ...state,
      items: items,
      error: null,
      status: 'success',
    };
  }),

  on(addItemFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: 'error',
  })),

  /**
   *
   * Update
   *
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

  on(socketUpdateItem, (state, { item }) => {
    //take copy of items
    const items = [...state.items];
    //get index of item to update
    const index = items.findIndex(obj => obj.id === item.id);
    //override old item with new item
    items[index] = item;
    return {
      ...state,
      items: items,
    };
  }),

  //update id of single item
  on(updateItemSuccess, state => ({
    ...state,
    error: null,
    status: 'success',
  })),

  on(updateItemFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: 'error',
  })),

  /**
   *
   * Delete
   *
   */
  //delete single Item
  on(deleteItem, (state, { item }) => ({
    ...state,
    items: state.items.filter(it => it.id !== item.id),
  })),

  on(socketDeleteItem, (state, { id }) => ({
    ...state,
    items: state.items.filter(item => item.id !== id),
  })),

  on(deleteItemSuccess, state => ({
    ...state,
    error: null,
    status: 'success',
  })),

  on(deleteItemFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: 'error',
  })),

  /**
   *
   * Load
   *
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
  })),

  /**
   *
   * Other
   *
   */
  on(toggleSortOrder, state => {
    const newSortOrder =
      state.sortOrder === 'ascending' ? 'decending' : 'ascending';
    return {
      ...state,
      sortOrder: newSortOrder,
    };
  }),

  on(sortList, state => {
    let newItems = [...state.items];
    newItems.sort(function (a, b) {
      const x = equalizeString(a.name);
      const y = equalizeString(b.name);
      return (state.sortOrder === 'ascending' ? x > y : x < y) ? 1 : -1;
    });
    return {
      ...state,
      items: [...newItems],
    };
  })
);
