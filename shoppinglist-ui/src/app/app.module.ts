import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownDirective } from './shared/dropdown.directive';
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
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { EffectsModule } from '@ngrx/effects';
import { ShoppingListEffects } from './shopping-list/store/shopping-list.effects';

import { ShoppingListService } from './shopping-list/shopping-list.service';
import { ShoppingListMockService } from './shopping-list/shopping-list.mock.service';
import { AddItemComponent } from './shopping-list/add-item/add-item.component';
import { EditItemComponent } from './shopping-list/edit-item/edit-item.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from './shared/socket.service';
import { SocketMockService } from './shared/socket.mock.service';

registerLocaleData(de);

const socketConfig: SocketIoConfig = {
  url: '',
  options: { path: '/api/socket' },
};

//Module imports that should be used wether mock env is true or not
const mockImports = environment.mock
  ? []
  : [SocketIoModule.forRoot(socketConfig)];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShoppingListComponent,
    DropdownDirective,
    ClickOutsideDirective,
    AddItemComponent,
    EditItemComponent,
  ],
  imports: [
    ...mockImports,
    BrowserModule,
    BrowserAnimationsModule,
    NzAutocompleteModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientModule,
    NzInputModule,
    NzFormModule,
    NzInputNumberModule,
    NzIconModule,
    NzButtonModule,
    NzLayoutModule,
    NzMenuModule,
    NzGridModule,
    NzListModule,
    NzBadgeModule,
    NzDividerModule,
    NzSkeletonModule,
    NzSpinModule,
    NzNotificationModule,
    NzModalModule,
    StoreModule.forRoot({
      shoppingList: shoppingListReducer,
    }),
    EffectsModule.forRoot([ShoppingListEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
  ],
  providers: [
    ...generateMockProviders(),
    { provide: NZ_I18N, useValue: de_DE },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

function generateMockProviders() {
  if (!environment.mock) {
    return [
      {
        //initialize SocketService on startup
        provide: APP_INITIALIZER,
        useFactory: (ss: SocketService) => () => {
          return ss.init();
        },
        deps: [SocketService],
        multi: true,
      },
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
      provide: SocketService,
      useClass: SocketMockService,
    },
    {
      provide: ShoppingListService,
      useClass: ShoppingListMockService,
    },
  ];
}
