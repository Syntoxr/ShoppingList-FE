import { createActionGroup, props } from '@ngrx/store';
import { Category } from '../types';

export const CategoriesActions = createActionGroup({
  source: 'Categories',
  events: {
    'Add categorie': props<{ categorie: Category }>(),
    'Delete categorie': props<{ categorie: Category }>(),
  },
});
