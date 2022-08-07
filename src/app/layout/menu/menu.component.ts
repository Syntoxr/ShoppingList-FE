import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  languageList: AvailableLangs = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    public translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.languageList = this.translocoService.getAvailableLangs();
  }

  logout() {
    this.close.emit();
    this.authService.logout();
  }

  entryClicked(url: string[]) {
    this.close.emit();
    this.router.navigate([...url]);
  }
}
