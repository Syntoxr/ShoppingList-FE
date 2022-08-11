import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  logout() {
    this.close.emit();
    this.authService.logout();
  }

  entryClicked(url: string[]) {
    this.close.emit();
    this.router.navigate([...url]);
  }
}
