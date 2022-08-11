import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Item } from 'src/app/shared/types';

export const ShoppingListActions = createActionGroup({
  source: 'Shopping List',
  events: {
    /**
     * Add
     */
    'Add item': props<{ item: Item }>(),
    'Socket Add item': props<{ item: Item }>(),
    'Add item success': props<{ oldId: number; newId: number }>(),
    'Add item failure': props<{ error: string }>(),
    /**
     * Update
     */
    'Update item': props<{ item: Item }>(),
    'Socket Update item': props<{ item: Item }>(),
    'Update item success': emptyProps(),
    'Update item failure': props<{ error: string }>(),
    /**
     * Delete
     */
    'Delete item': props<{ item: Item }>(),
    'Socket delete item': props<{ id: number }>(),
    'Delete item success': emptyProps(),
    'Delete item failure': props<{ error: string }>(),
    /**
     * Load
     */
    'Load Items': emptyProps(),
    'Load items success': props<{ items: Item[] }>(),
    'Load items failure': props<{ error: string }>(),
    /**
     * Other
     */
    'Toggle sort order': emptyProps(),
    'Sort list': emptyProps(),
  },
});
