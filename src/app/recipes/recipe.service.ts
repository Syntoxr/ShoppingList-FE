import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { DataStorageService } from "../shared/data-storage.service";
import { Item } from "../shared/item.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()

export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [];



      constructor(private shoppinglistService: ShoppingListService) {}

      getRecipe(index: number) {
        return this.recipes[index];
      }

      getRecipes() {
          return this.recipes.slice();
      }

      addItemsToShoppingList(ingredients: Item[]) {
        this.shoppinglistService.addItems(ingredients);
      }

      setRecipes(recipes: Recipe[]) {
        console.log('setting recipes');
        this.recipes = recipes;
        this.recipesChanged.next(recipes);
      }

      addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
      }

      updateRecipe(index: number, recipe: Recipe) {
        this.recipes[index] = recipe;
        this.recipesChanged.next(this.recipes.slice());
      }

      deleteRecipe(index: number) {
        this.recipes.splice(index ,1); 
        this.recipesChanged.next(this.recipes.slice());
      }
}
