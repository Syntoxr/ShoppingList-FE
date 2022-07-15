import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Socket } from 'ngx-socket-io';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private hasError = false;
  private currentNotificationId = '';

  constructor(
    private socket: Socket,
    private notification: NzNotificationService,
    private translocoService: TranslocoService
  ) {}

  connect(token: string): Promise<void> {
    this.socket.ioSocket.url = '';
    this.socket.ioSocket.io.opts.extraHeaders = {
      authorization: `Bearer ${token}`,
    };

    return new Promise((resolve, reject) => {
      if (!token) {
        reject('missing token');
      }
      try {
        this.socket.connect();
      } catch (error) {
        console.error(error);
        console.error('could not connect to backend');
        reject(error);
      }
      this.createRoomListeners();
      resolve();
    });
  }

  createRoomListeners() {
    //listen on rooms

    this.socket.on('connect', () => {
      console.info('connected to backend');
      if (this.hasError) {
        this.hasError = false;
        this.notification.remove(this.currentNotificationId);
        /**
         * t(socket.notification.reconnect.title)
         * t(socket.notification.reconnect.content)
         */
        this.notification.success(
          this.translocoService.translate(
            'socket.notification.reconnect.title'
          ),
          this.translocoService.translate(
            'socket.notification.reconnect.content'
          ),
          {
            nzKey: 'socket',
            nzDuration: 5000,
          }
        );
      }
    });

    // #region error handlers

    //handle errors

    this.socket.on('connect_error', () => {
      console.error('could not connect to backend');
      this.hasError = true;
      /**
       * t(socket.notification.connect-error.title)
       * t(socket.notification.connect-error.content)
       */
      this.currentNotificationId = this.notification.error(
        this.translocoService.translate(
          'socket.notification.connect-error.title'
        ),
        this.translocoService.translate(
          'socket.notification.connect-error.content'
        ),
        {
          nzKey: 'socket',
          nzDuration: 600000,
        }
      ).messageId;
    });

    this.socket.on('disconnect', () => {
      console.error('disconnected from backend');
      this.hasError = true;
      /**
       * t(socket.notification.disconnect.title)
       * t(socket.notification.disconnect.content)
       */
      this.currentNotificationId = this.notification.error(
        this.translocoService.translate('socket.notification.disconnect.title'),
        this.translocoService.translate(
          'socket.notification.disconnect.content'
        ),
        {
          nzKey: 'socket',
          nzDuration: 600000,
        }
      ).messageId;
    });

    // #endregion
  }
}
