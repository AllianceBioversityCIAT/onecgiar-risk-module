import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { MainService } from './main.service';
import { saveAs } from 'file-saver';
@Injectable({
  providedIn: 'root',
})
export class UserService extends MainService {
  constructor(private http: HttpClient) {
    super();
  }

  async login(email: string) {
    let result = await firstValueFrom(
      this.http
        .post(this.backend_url + `/auth/login`, {
          username: email,
          password: '123',
        })
        .pipe(map((d) => d))
    ).catch((e) => false);

    return result;
  }

  async getUsers(filters: any = null) {
    let finalFilters: any = {};
    if (filters)
      Object.keys(filters).forEach((element) => {
        if (typeof filters[element] === 'string')
          filters[element] = filters[element].trim();

        if (filters[element] != null && filters[element] != '')
          finalFilters[element] = filters[element];
      });
    return firstValueFrom(
      this.http
        .get(this.backend_url + `/users`, {
          params: finalFilters,
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async addUser(data: any) {
    return firstValueFrom(
      this.http
        .post(this.backend_url + `/users`, data, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async updateUser(data: any) {
    return firstValueFrom(
      this.http
        .put(this.backend_url + `/users`, data, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }
  async deleteUser(id: any) {
    return firstValueFrom(
      this.http
        .delete(this.backend_url + `/users/${id}`, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  getLogedInUser(): any {
    return jwt_decode(localStorage.getItem('access_token') as string);
  }

  async exportUsers() {
    const data: any = await firstValueFrom(
      this.http
        .get(this.backend_url + '/users/export/all', {
          headers: this.headers,
          responseType: 'blob',
        })
        .pipe(map((d: Blob) => d))
    );
    saveAs(data, 'Users-all.xlsx');
  }
}
