import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket: any;

  constructor() {}

  setupSocketConnection() {
    const token = 'Bearer ' + JSON.parse(localStorage.getItem('userData'))._token;
    this.socket = io(environment.SOCKET_ENDPOINT, {
      query: {
        token,
      },
    });

    this.socket.on('connect', () => {
      this.socket.token = token;
    });
  }

  getSocket() {
    return this.socket;
  }
}
