import { Injectable, NgModule } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class AppSocket extends Socket {

    constructor() {
      const token=  localStorage.getItem('access_token');
        super({ url: 'http://localhost:3000', options: { autoConnect:false, auth:{authorization:'Barer '+token}} });
    }

}