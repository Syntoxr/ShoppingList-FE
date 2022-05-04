import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DropdownDirective } from './shared/dropdown.directive';

import { StoreModule } from '@ngrx/store';
import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { de_DE } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

import { EffectsModule } from '@ngrx/effects';
import { ShoppingListEffects } from './shopping-list/store/shopping-list.effects';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from './shared/socket.service';
import { SocketMockService } from './shared/socket.mock.service';
import { ShoppingListModule } from './shopping-list/shopping-list.module';

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
  declarations: [AppComponent, HeaderComponent, DropdownDirective],
  imports: [
    ...mockImports,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NzButtonModule,
    NzLayoutModule,
    NzMenuModule,
    NzGridModule,
    NzSpinModule,
    NzNotificationModule,
    StoreModule.forRoot({
      shoppingList: shoppingListReducer,
    }),
    EffectsModule.forRoot([ShoppingListEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    ShoppingListModule,
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
    ];
  }
  return [
    {
      provide: SocketService,
      useClass: SocketMockService,
    },
  ];
}
