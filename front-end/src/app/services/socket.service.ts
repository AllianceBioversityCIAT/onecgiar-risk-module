import { Injectable, NgModule } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable()
export class AppSocket extends Socket {
  constructor() {
    const token = localStorage.getItem('access_token');
    super({
      url: '/',
      options: {
        path: '/api/socket.io',
        autoConnect: false,
        auth: { authorization: 'Barer ' + token },
      },
    });
  }
}
