import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  async login(email: string) {
    let result = await firstValueFrom(
      this.http
        .post(environment.backend_url + `/auth/login`, {
          username: email,
          password:'123'
        })
        .pipe(map((d) => d))
    ).catch(e=>false);
  
    return result;
  }

  getLogedInUser():any{
    
  return jwt_decode(localStorage.getItem('access_token') as string);
  }
}
