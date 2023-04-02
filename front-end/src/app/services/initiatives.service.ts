import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InitiativesService {


  backend_url= environment.backend_url;
  constructor(private http: HttpClient) {

  }

  get headers() {
    return {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + localStorage.getItem('token'),
    }
  }

  getInitiatives() {
    return this.http.get(this.backend_url + '/initiative', { headers: this.headers }).toPromise();
  }
}
