import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StoreModule } from '@ngrx/store';
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
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { EffectsModule } from '@ngrx/effects';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from './shared/socket.service';
import { SocketMockService } from './shared/socket.mock.service';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { AuthModule } from './auth/auth.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HeaderComponent } from './layout/header/header.component';
import { MenuComponent } from './layout/menu/menu.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';

registerLocaleData(de);

const socketConfig: SocketIoConfig = {
  url: '', //temp url. Can be overwritten in socket.service.ts
  options: { autoConnect: false, path: '/api/socket' },
};

//Module imports that should be used wether mock env is true or not
const mockImports = environment.mock
  ? []
  : [SocketIoModule.forRoot(socketConfig)];

@NgModule({
  declarations: [AppComponent, HeaderComponent, MenuComponent],
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
    NzIconModule,
    NzModalModule,
    NzDropDownModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    AuthModule,
    ShoppingListModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    HttpClientModule,
    TranslocoRootModule,
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
    return [];
  }
  return [
    {
      provide: SocketService,
      useClass: SocketMockService,
    },
  ];
}
