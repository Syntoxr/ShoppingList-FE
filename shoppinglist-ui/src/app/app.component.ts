import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectStatus } from './shopping-list/store/shopping-list.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  status$ = this.store.select(selectStatus);

  constructor(private store: Store) {}
}
