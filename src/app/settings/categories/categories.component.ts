import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CategoriesFeature } from 'src/app/shared/categories-store/categories.reducer';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.less'],
})
export class CategoriesComponent implements OnInit {
  categories$?;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.categories$ = this.store.select(CategoriesFeature.selectCategories);
  }
}
