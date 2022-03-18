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
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          transform: 'translateX(100%)'
        }),
        animate(100)
      ]),
      transition('* => void',
        animate(100, style({
          transform: 'translateX(100%)'
        })))
    ])
  ]
})

export class NotifyComponent implements OnInit, OnDestroy {
  displayNotification = false;
  notification: WebNotification;
  notifySub: Subscription;
  notifyCssClass = '';


  constructor(private notifyService: NotifyService) { }

  ngOnInit(): void {
    this.notifySub = this.notifyService.newNotification.subscribe(notification => {
      this.notification = notification;
      this.displayNotification = true
      console.log(notification.level);

      switch (notification.level) {
        case NotificationLevels.Info:
          this.notifyCssClass = "notify-info";
          break;

        case NotificationLevels.Warn:
          this.notifyCssClass = "notify-warn";
          break;

        case NotificationLevels.Error:
          this.notifyCssClass = "notify-error";
          break;

        default:
          this.notifyCssClass = "notify-warn";
      }
      console.log(this.notifyCssClass); 

      setTimeout(() => {
        this.displayNotification = false
      } ,this.notification.duration);
    })
  }



  ngOnDestroy(): void {
    this.notifySub.unsubscribe();
  }

  onClick() {
    alert(this.notification.description);
  }

}
