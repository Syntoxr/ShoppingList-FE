import { APP_INITIALIZER, NgModule } from '@angular/core';

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
import { ShoppingListComponent } from './shopping-list.component';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingListMockService } from './shopping-list.mock.service';
import { HttpClientModule } from '@angular/common/http';

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
  ],
  providers: [...generateMockProviders()],
  exports: [ShoppingListComponent, AddItemComponent, EditItemComponent],
})
export class ShoppingListModule {}

function generateMockProviders() {
  if (!environment.mock) {
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
