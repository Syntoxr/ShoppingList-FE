import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { SettingsModule } from './settings/settings.module';

import { ShoppingListComponent } from './shopping-list/shopping-list.component';

const wildcardPath = environment.mock
  ? { path: '**', redirectTo: '' }
  : { path: '**', redirectTo: '/shopping-list' };

const routes: Routes = [
  ...getEnvironmentPaths(),
  { path: 'auth', component: AuthComponent },
  {
    path: 'settings',
    loadChildren: () => SettingsModule,
    canActivate: [AuthGuard],
  },
  wildcardPath,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

function getEnvironmentPaths(): Route[] {
  if (environment.mock) {
    return [
      {
        path: '',
        component: ShoppingListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
    ];
  } else {
    return [
      { path: '', redirectTo: '/shopping-list', pathMatch: 'full' },
      {
        path: 'shopping-list',
        component: ShoppingListComponent,
        canActivate: [AuthGuard],
      },
    ];
  }
}
