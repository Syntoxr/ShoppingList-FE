import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { CategoriesFeature } from './categories-store/categories.reducer';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(CategoriesFeature)],
})
export class SharedModule {}
