import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { HttpClientModule } from '@angular/common/http';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { AuthMockService } from './auth.mock.service';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    HttpClientModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzTypographyModule,
    NzButtonModule,
    NzCheckboxModule,
    NzNotificationModule,
    TranslocoModule,
  ],
  providers: [...generateMockProviders()],
  exports: [AuthComponent],
})
export class AuthModule {}

function generateMockProviders() {
  if (!environment.mock) {
    return [];
  }
  return [
    {
      provide: AuthService,
      useClass: AuthMockService,
    },
  ];
}
