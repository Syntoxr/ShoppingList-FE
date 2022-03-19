import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotifyService } from 'src/app/shared/notify/notify.service';
import { NotificationLevels, WebNotification } from './web-notification.model';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.less'],
  animations: [
    trigger('notification', [
      state('in', style({
        transform: 'translateY(0)'
      })),
      transition('void => *', [
        style({
          transform: 'translateY(-100%)'
        }),
        animate(150)
      ]),
      transition('* => void',
        animate(150, style({
          transform: 'translateY(-100%)'
        })))
    ])
  ]
})

export class NotifyComponent implements OnInit, OnDestroy {
  notification = new WebNotification('');
  notifySub: Subscription;
  notifyCssClass = '';
  displayNotification = false;


  constructor(private notifyService: NotifyService) { }

  ngOnInit(): void {
    this.notifySub = this.notifyService.newNotification.subscribe(notification => {
      this.notification = notification;
      console.log(notification.level);
      this.displayNotification = true;

      switch (notification.level) {
        case NotificationLevels.Info:
          this.notifyCssClass = "notify-info";
          break;

        case NotificationLevels.Success:
          this.notifyCssClass = "notify-success";
          break;

        case NotificationLevels.Warn:
          this.notifyCssClass = "notify-warn";
          break;

        case NotificationLevels.Error:
          this.notifyCssClass = "notify-error";
          break;

        default:
          this.notifyCssClass = "notify-info";
      }
      console.log(this.notifyCssClass); 

      setTimeout(() => {
        this.displayNotification = false;
      } ,this.notification.duration);
    })
  }



  ngOnDestroy(): void {
    this.notifySub.unsubscribe();
  }

  onClick() {
    alert(this.notification.message);
  }
}
