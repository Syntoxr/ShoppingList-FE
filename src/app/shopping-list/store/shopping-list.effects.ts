import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { ShoppingListService } from '../shopping-list.service';
import { ShoppingListActions } from './shopping-list.actions';

@Injectable()
export class ShoppingListEffects {
  // #region CRUD operations

  //sends added item to backend
  saveAddedItem = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppingListActions.addItem),
      switchMap(payload =>
        from(this.shoppingListService.addItem(payload.item)).pipe(
          map(({ oldId, newId }) => {
            return ShoppingListActions.addItemSuccess({ oldId, newId });
          }),
          catchError(error => of(ShoppingListActions.addItemFailure({ error })))
        )
      )
    )
  );

  // get all shopping list items from backend
  loadItems = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppingListActions.loadItems),
      switchMap(() =>
        // Call getItems method, convert it to an observable
        from(this.shoppingListService.getItems()).pipe(
          // Take the returned value and return a new success action containing items
          map(items => ShoppingListActions.loadItemsSuccess({ items })),
          // Or... if an error occurs, return a new failure action containing the error string
          catchError(error =>
            of(ShoppingListActions.loadItemsFailure({ error }))
          )
        )
      )
    )
  );

  //post new item with temporary id to backend.
  //Returns old- and new id in order to update the local temp id
  saveUpdatedItem = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppingListActions.updateItem),
      switchMap(payload =>
        from(this.shoppingListService.updateItem(payload.item)).pipe(
          map(() => {
            return ShoppingListActions.updateItemSuccess();
          }),
          catchError(error =>
            of(ShoppingListActions.updateItemFailure({ error }))
          )
        )
      )
    )
  );

  //delete item from backend
  deleteItem = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppingListActions.deleteItem),
      switchMap(payload =>
        from(this.shoppingListService.deleteItem(payload.item.id)).pipe(
          map(() => {
            return ShoppingListActions.deleteItemSuccess();
          }),
          catchError(error =>
            of(ShoppingListActions.deleteItemFailure({ error }))
          )
        )
      )
    )
  );

  // #endregion

  //sort list when order changed
  sortList = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ShoppingListActions.toggleSortOrder,
        ShoppingListActions.addItem,
        ShoppingListActions.updateItem,
        ShoppingListActions.loadItemsSuccess,
        ShoppingListActions.socketAddItem,
        ShoppingListActions.socketUpdateItem,
        ShoppingListActions.socketDeleteItem
      ),
      map(() => ShoppingListActions.sortList())
    )
  );

  notifyOnError = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ShoppingListActions.loadItemsFailure,
          ShoppingListActions.addItemFailure,
          ShoppingListActions.updateItemFailure
        ),
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

  constructor(
    private actions$: Actions,
    private shoppingListService: ShoppingListService,
    private notification: NzNotificationService
  ) {}
}
