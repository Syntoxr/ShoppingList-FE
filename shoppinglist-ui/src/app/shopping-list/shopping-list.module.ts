import { environment } from 'src/environments/environment';

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

import { ShoppingListComponent } from './shopping-list.component';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingListMockService } from './shopping-list.mock.service';
import { StoreModule } from '@ngrx/store';
import { shoppingListReducer } from './store/shopping-list.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ShoppingListEffects } from './store/shopping-list.effects';

@NgModule({
  declarations: [ShoppingListComponent, AddItemComponent, EditItemComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NzAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzIconModule,
    NzButtonModule,
    NzLayoutModule,
    NzGridModule,
    NzListModule,
    NzBadgeModule,
    NzDividerModule,
    NzSkeletonModule,
    NzModalModule,
    NzNotificationModule,
    StoreModule.forFeature('shoppingList', shoppingListReducer),
    EffectsModule.forFeature([ShoppingListEffects]),
  ],
  providers: [...generateMockProviders()],
  exports: [ShoppingListComponent, AddItemComponent, EditItemComponent],
})
export class ShoppingListModule {}

function generateMockProviders() {
  if (environment.mock === false) {
    return [
      {
        //initialize ShoppingListService on startup
        provide: APP_INITIALIZER,
        useFactory: (sls: ShoppingListService) => () => {
          return sls.init();
        },
        deps: [ShoppingListService],
        multi: true,
      },
    ];
  }
  return [
    {
      provide: ShoppingListService,
      useClass: ShoppingListMockService,
    },
  ];
}
