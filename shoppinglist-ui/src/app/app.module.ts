import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingListEditComponent } from './shopping-list/shopping-list-edit/shopping-list-edit.component';
// import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
// import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
// import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
// import { RecipesComponent } from './recipes/recipes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownDirective } from './shared/dropdown.directive';
// import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
// import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
// import { RecipeService } from './recipes/recipe.service';
import { NotifyComponent } from './shared/notify/notify.component';
import { ClickOutsideDirective } from './shared/click-outside.directive';

import { StoreModule } from '@ngrx/store';
import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { de_DE } from 'ng-zorro-antd/i18n';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';

registerLocaleData(de);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShoppingListComponent,
    ShoppingListEditComponent,
    // RecipeListComponent,
    // RecipeItemComponent,
    // RecipeDetailComponent,
    // RecipesComponent,
    DropdownDirective,
    ClickOutsideDirective,
    // RecipeStartComponent,
    // RecipeEditComponent,
    NotifyComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NzAutocompleteModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientModule,
    StoreModule.forRoot({ shoppingList: shoppingListReducer }),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
  ],
  // providers: [RecipeService],
  providers: [{ provide: NZ_I18N, useValue: de_DE }],
  bootstrap: [AppComponent],
})
export class AppModule {}
