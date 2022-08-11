import { createFeature, createReducer, on } from '@ngrx/store';
import { equalizeString } from 'src/app/shared/helper-functions';
import { Item } from 'src/app/shared/types';
import { ShoppingListActions } from './shopping-list.actions';

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
  status: null,
};

export const shoppingListFeature = createFeature({
  name: 'shoppingList',
  reducer: createReducer<ShoppingListState>(
    //supply initial state
    initialState,

    /**
     *
     * Add
     *
     */
    //add single Item
    on(ShoppingListActions.addItem, (state, { item }) => ({
      ...state,
      items: [...state.items, item],
      status: 'saving',
    })),

    on(ShoppingListActions.socketAddItem, (state, { item }) => ({
      ...state,
      items: [...state.items, item],
    })),

    on(ShoppingListActions.addItemSuccess, (state, { oldId, newId }) => {
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

    on(ShoppingListActions.addItemFailure, (state, { error }) => ({
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
    on(ShoppingListActions.updateItem, (state, { item }) => {
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

    on(ShoppingListActions.socketUpdateItem, (state, { item }) => {
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
    on(ShoppingListActions.updateItemSuccess, state => ({
      ...state,
      error: null,
      status: 'success',
    })),

    on(ShoppingListActions.updateItemFailure, (state, { error }) => ({
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
    on(ShoppingListActions.deleteItem, (state, { item }) => ({
      ...state,
      items: state.items.filter(it => it.id !== item.id),
    })),

    on(ShoppingListActions.socketDeleteItem, (state, { id }) => ({
      ...state,
      items: state.items.filter(item => item.id !== id),
    })),

    on(ShoppingListActions.deleteItemSuccess, state => ({
      ...state,
      error: null,
      status: 'success',
    })),

    on(ShoppingListActions.deleteItemFailure, (state, { error }) => ({
      ...state,
      error: error,
      status: 'error',
    })),

    /**
     *
     * Load
     *
     */
    on(ShoppingListActions.loadItems, state => ({
      ...state,
      status: 'loading',
    })),

    //loading of items from backend succeeded
    on(ShoppingListActions.loadItemsSuccess, (state, { items }) => ({
      ...state,
      items: items,
      error: null,
      status: 'success',
    })),

    //loading of items from backend failed
    on(ShoppingListActions.loadItemsFailure, (state, { error }) => ({
      ...state,
      error: error,
      status: 'error',
    })),

    /**
     *
     * Other
     *
     */
    on(ShoppingListActions.toggleSortOrder, state => {
      const newSortOrder =
        state.sortOrder === 'ascending' ? 'decending' : 'ascending';
      return {
        ...state,
        sortOrder: newSortOrder,
      };
    }),

    on(ShoppingListActions.sortList, state => {
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
  ),
});
