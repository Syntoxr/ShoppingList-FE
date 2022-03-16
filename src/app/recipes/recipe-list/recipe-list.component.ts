import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.less']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  recipesChangesSub: Subscription;

  constructor(private recipeService: RecipeService, private dataStorageService: DataStorageService) {

   }

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
    this.recipesChangesSub = this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    );
  }


  ngOnDestroy() {
    this.recipesChangesSub.unsubscribe();
  }
}
