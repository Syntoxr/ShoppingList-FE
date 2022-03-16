import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WebNotification, NotificationLevels } from './web-notification.model';

@Injectable({
  providedIn: 'root'
})

export class NotifyService {
  newNotification = new Subject<WebNotification>();

  constructor() { }


  info(title: string, description?: string, duration?: number) {
    const notification = new WebNotification(
      title,
      description,
      NotificationLevels.Info,
      duration
    );

    this.newNotification.next(notification);

  }

  warn(title: string, description?: string, duration?: number) {
    const notification = new WebNotification(
      title,
      description,
      NotificationLevels.Warn,
      duration
    );
    this.newNotification.next(notification);

  }

  error(title: string, description?: string, duration?: number) {
    const notification = new WebNotification(
      title,
      description,
      NotificationLevels.Error,
      duration
    );
    this.newNotification.next(notification);

  }
}
