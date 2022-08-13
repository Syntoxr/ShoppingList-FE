import { createFeature, createReducer, on } from '@ngrx/store';
import { Category } from '../types';
import { CategoriesActions } from './categories.actions';

export interface CategoriesState {
  categories: Category[];
}

export const initialState: CategoriesState = {
  categories: [
    { name: 'Vegetables', color: '#66bb6a', id: 1, icon: 'carrot.svg' },
    { name: 'Meat', color: '#ff7043', id: 2 },
    { name: 'Candy', color: '#007043', id: 3 },
  ],
};

export const CategoriesFeature = createFeature({
  name: 'categories',
  reducer: createReducer<CategoriesState>(
    initialState,
    on(CategoriesActions.addCategorie, (state, { categorie }) => ({
      ...state,
      categories: [...state.categories, categorie],
    })),
    on(CategoriesActions.deleteCategorie, (state, { categorie }) => ({
      ...state,
      categories: state.categories.filter(cat => cat.id !== categorie.id),
    }))
  ),
});
