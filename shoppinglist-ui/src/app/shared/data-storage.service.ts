import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Item } from './item.model';
import { NotifyService } from './notify/notify.service';
// import { map, tap } from 'rxjs/operators';
// import { Recipe } from '../recipes/recipe.model';
// import { RecipeService } from '../recipes/recipe.service';

class ItemRequest {
  constructor(item: Item, action: "add" | "update") {}
}


@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  shoppinglistUrl = environment.apiEndpoints.shoppinglist;

  //constructor(private http: HttpClient, private recipeService: RecipeService) { }
  constructor(private http: HttpClient, private shoppingListService: ShoppingListService, private notify: NotifyService) { }

  addItem(item: Item) {
    this.http.post<{oldId: number, newId: number}>(this.shoppinglistUrl, item)
    .pipe(
      retry(2),
      catchError(error => {
        this.handleError(error);
        return throwError(() => new Error(error))
      })
    )
    .subscribe(
      response => {
        this.shoppingListService.updateItemId(response.oldId, response.newId);
      }
    );
  }


  updateItem(item: Item) {
    this.http.patch(this.shoppinglistUrl, item)
    .pipe(retry(2),
    catchError(error => {
      this.handleError(error);
      return throwError(() => new Error(error))
    })
    )
    .subscribe();
  }


  fetchItems() {
    this.http.get<Item[]>(this.shoppinglistUrl)
    .pipe(
      retry(2),
      catchError(error => {
      this.handleError(error);
      return throwError(() => new Error(error))
    })
    )
    .subscribe(response => {
      this.shoppingListService.addItems(response);
    }
    )
  }






  private handleError(error: HttpErrorResponse, message: string= "Fehler während Kommunikation zum Server. \n Änderungen konnten nicht gespeichert werden!") {
    this.notify.error(
      error.status.toString() + " " + error.statusText, 
      message ? message:error.message, 
      10000);
  }





























  // storeRecipes() {
  //   console.log('store called');
  //   const recipes = this.recipeService.getRecipes();
  //   this.http.put(this.recipeUrl, recipes).subscribe(
  //     response => {
  //       console.log(response);
  //     }
  //   )
  // }

  // fetchRecipes() { //fetch recipes from server defined in recipeUrl and store them in recipeService
  //   console.log('fetching recipes...')
  //   return this.http.get<Recipe[]>(this.recipeUrl)
  //   .pipe(map(recipes => { //ensure items property is not empty
  //     return recipes.map(recipe => {
  //       return {...recipe, items: recipe.items ? recipe.items:[]}
  //     });
  //   }),
  //   tap(recipes => {
  //     this.recipeService.setRecipes(recipes);
  //   })
  //   );
  // }
}
