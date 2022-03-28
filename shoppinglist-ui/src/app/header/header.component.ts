import { Component } from '@angular/core';
import { NotifyService } from '../shared/notify/notify.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  collapsed = true;

  constructor(private notify: NotifyService) {}

  onSave() {
    // this.dataStorageService.storeRecipes();
  }

  onFetch() {
    // this.dataStorageService.fetchRecipes().subscribe();
  }

  onNotify() {
    this.notify.info('Test!', 'This Test description!', 7000);
  }
}
