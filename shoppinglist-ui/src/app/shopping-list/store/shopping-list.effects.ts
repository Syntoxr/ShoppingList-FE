import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { ShoppingListService } from '../shopping-list.service';
import {
  addItem,
  addItemFailure,
  addItemSuccess,
  loadItems,
  loadItemsFailure,
  loadItemsSuccess,
  sortList,
  toggleSortOrder,
  updateItem,
  updateItemFailure,
  updateItemSuccess,
} from './shopping-list.actions';

@Injectable()
export class ShoppingListEffects {
  constructor(
    private actions$: Actions,
    private shoppingListService: ShoppingListService,
    private notification: NzNotificationService
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
  saveUpdatedItem = createEffect(() =>
    this.actions$.pipe(
      ofType(updateItem),
      switchMap(payload =>
        from(this.shoppingListService.updateItem(payload.item)).pipe(
          map(() => {
            return updateItemSuccess();
          }),
          catchError(error => of(updateItemFailure({ error })))
        )
      )
    )
  );

  //sends added item to backend
  saveAddedItem = createEffect(() =>
    this.actions$.pipe(
      ofType(addItem),
      switchMap(payload =>
        from(this.shoppingListService.addItem(payload.item)).pipe(
          map(({ oldId, newId }) => {
            return addItemSuccess({ oldId, newId });
          }),
          catchError(error => of(addItemFailure({ error })))
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

  notifyOnError = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadItemsFailure, addItemFailure, updateItemFailure),
        tap(error => {
          const httpError = <HttpErrorResponse>(
            JSON.parse(JSON.stringify(error.error))
          );
          this.notification.create(
            'error',
            'Error ' + httpError.status + ' ' + httpError.statusText,
            JSON.stringify(httpError.message)
          );
        })
      ),
    { dispatch: false }
  );
}
