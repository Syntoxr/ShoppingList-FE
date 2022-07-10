import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Socket } from 'ngx-socket-io';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private hasError = false;
  private currentNotificationId = '';

  constructor(
    private socket: Socket,
    private notification: NzNotificationService
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
        this.notification.success(
          'Socket OK',
          'Du wirst wieder live Updates erhalten',
          {
            nzKey: 'socket',
            nzDuration: 7000,
          }
        );
      }
    });

    // #region error handlers

    //handle errors

    this.socket.on('connect_error', () => {
      console.error('could not connect to backend');
      this.hasError = true;
      this.currentNotificationId = this.notification.error(
        'Konnte nicht mit Server verbinden',
        'Du wirst keine live Updates erhalten',
        {
          nzKey: 'socket',
          nzDuration: 600000,
        }
      ).messageId;
    });

    this.socket.on('disconnect', () => {
      console.error('disconnected from backend');
      this.hasError = true;
      this.currentNotificationId = this.notification.error(
        'Verbindung zu Server unterbrochen',
        'Du wirst keine live Updates erhalten',
        {
          nzKey: 'socket',
          nzDuration: 600000,
        }
      ).messageId;
    });

    // #endregion
  }
}
