import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { ShoppingListService } from '../shopping-list.service';
import {
  addItem,
  loadItems,
  loadItemsFailure,
  loadItemsSuccess,
  sortList,
  toggleSortOrder,
  updateItem,
  updateItemFailure,
  updateItemId,
} from './shopping-list.actions';

@Injectable()
export class ShoppingListEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private shoppingListService: ShoppingListService
  ) {}

  // get all shopping list items from backend
  loadItems = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems),
      switchMap(() =>
        // Call getItems method, convert it to an observable
        from(this.shoppingListService.getItems()).pipe(
          // Take the returned value and return a new success action containing items
          map(items => loadItemsSuccess({ items })),
          // Or... if an error occurs, return a new failure action containing the error string
          catchError(error => of(loadItemsFailure({ error })))
        )
      )
    )
  );

  //post new item with temporary id to backend.
  //Returns old- and new id in order to update the local temp id
  saveUpdatedItem = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateItem),
        switchMap(payload =>
          from(this.shoppingListService.updateItem(payload.item)).pipe(
            catchError(error => of(updateItemFailure({ error })))
          )
        )
      ),
    { dispatch: false }
  );

  //sends updated item to backend
  saveAddedItem = createEffect(() =>
    this.actions$.pipe(
      ofType(addItem),
      switchMap(payload =>
        from(this.shoppingListService.addItem(payload.item)).pipe(
          map(({ oldId, newId }) => updateItemId({ oldId, newId }))
        )
      )
    )
  );

  //sort list when order changed
  sortList = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleSortOrder, addItem, updateItem, loadItemsSuccess),
      map(() => sortList())
    )
  );
}
