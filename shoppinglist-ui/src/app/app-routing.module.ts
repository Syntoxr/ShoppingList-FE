import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';

import { ShoppingListComponent } from './shopping-list/shopping-list.component';

const routes: Routes = [...getEnvironmentPaths()];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

function getEnvironmentPaths() {
  if (environment.mock) {
    return [
      { path: '', component: ShoppingListComponent, pathMatch: 'full' },
      { path: '**', redirectTo: '' },
    ];
  } else {
    return [
      { path: '', redirectTo: '/shopping-list', pathMatch: 'full' },
      { path: 'shopping-list', component: ShoppingListComponent },
      { path: '**', redirectTo: '/shopping-list' },
    ];
  }
}
