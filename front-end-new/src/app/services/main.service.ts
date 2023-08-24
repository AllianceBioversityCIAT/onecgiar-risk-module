import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  backend_url = environment.backend_url;

  get headers() {
    const access_token = localStorage.getItem('access_token');
    let headers: any = {
      'content-type': 'application/json',
    };
    if (access_token) headers['Authorization'] = 'Bearer ' + access_token;

    return headers;
  }
  constructor() {}
}
