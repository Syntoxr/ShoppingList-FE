import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { map, tap } from 'rxjs/operators';
// import { Recipe } from '../recipes/recipe.model';
// import { RecipeService } from '../recipes/recipe.service';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  // private recipeUrl = 'http://192.168.10.60:1880/endpoint/angular/recipes';

  //constructor(private http: HttpClient, private recipeService: RecipeService) { }
  constructor(private http: HttpClient) { }

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
