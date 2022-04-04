import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NotifyService } from '../shared/notify/notify.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent {
  mock = environment.mock;
  collapsed = true;

  constructor(private notify: NotifyService) {}

  onNotify() {
    this.notify.info('Test!', 'This Test description!', 7000);
  }
}
