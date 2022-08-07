import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { SocketService } from './socket.service';

@Injectable()
export class SocketMockService extends SocketService {
  mockCredentials = { username: 'user', password: 'notSave' };

  constructor(translocoService: TranslocoService) {
    super(undefined, undefined, translocoService);
  }

  override async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.info('connected to backend');
      this.createRoomListeners();
      resolve();
    });
  }

  override createRoomListeners() {
    console.log('would register socket rooms now');
  }
}
