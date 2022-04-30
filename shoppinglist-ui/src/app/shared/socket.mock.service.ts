import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable()
export class SocketMockService extends SocketService {
  constructor() {
    super(undefined, undefined);
  }

  override init() {
    console.log('would connecting to backend now');
  }
}
