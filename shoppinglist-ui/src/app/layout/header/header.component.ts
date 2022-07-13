import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/auth.service';
import { selectStatus } from 'src/app/shopping-list/store/shopping-list.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent {
  showMenu = false;
  status$ = this.store.select(selectStatus);

  constructor(private store: Store, public authService: AuthService) {}
}
