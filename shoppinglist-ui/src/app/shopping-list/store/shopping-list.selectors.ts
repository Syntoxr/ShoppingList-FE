import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { ShoppingListState } from './shopping-list.reducer';

export const selectShoppingList = (state: AppState) => state.shoppingList;

export const selectAllItems = createSelector(
  selectShoppingList,
  (state: ShoppingListState) => state.items
);

export const selectItem = (id: number) =>
  createSelector(selectShoppingList, state => {
    const index = state.items.findIndex(obj => obj.id === id);
    return state.items[index];
  });

export const selectItemByName = (name: string) =>
  createSelector(selectShoppingList, state => {
    const index = state.items.findIndex(obj => obj.name === name);
    return state.items[index];
  });

export const selectSortOrder = createSelector(
  selectShoppingList,
  (state: ShoppingListState) => state.sortOrder
);

export const selectEditedItem = createSelector(
  selectShoppingList,
  (state: ShoppingListState) => state.editedItem
);

export const selectEditingMode = createSelector(
  selectShoppingList,
  (state: ShoppingListState) => state.editingMode
);

export const selectError = createSelector(
  selectShoppingList,
  (state: ShoppingListState) => state.error
);

export const selectStatus = createSelector(
  selectShoppingList,
  (state: ShoppingListState) => state.status
);
