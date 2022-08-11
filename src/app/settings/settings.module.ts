import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TranslocoModule } from '@ngneat/transloco';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

import { SettingsComponent } from './settings.component';
import { GeneralComponent } from './general/general.component';
import { CategoriesComponent } from './categories/categories.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'general' },
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: 'general', component: GeneralComponent },
      { path: 'categories', component: CategoriesComponent },
    ],
  },
];

@NgModule({
  declarations: [SettingsComponent, GeneralComponent, CategoriesComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    FormsModule,
    NzMenuModule,
    NzLayoutModule,
    NzIconModule,
    NzGridModule,
    NzDividerModule,
    NzSelectModule,
    NzPageHeaderModule,
    RouterModule.forChild(routes),
  ],
  providers: [],
  exports: [SettingsComponent, GeneralComponent, SettingsComponent],
})
export class SettingsModule {}
