import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';
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

  async getUsers(filters: any = null, page: number, limit: number) {
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
        .get(this.backend_url + `/users?page=${page}&limit=${limit}`, {
          params: finalFilters,
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }


getUsersForTeamMember(filters: any = null): Observable<any> {
  let finalFilters: any = {};
  if (filters)
    Object.keys(filters).forEach((element) => {
      if (typeof filters[element] === 'string')
        filters[element] = filters[element].trim();

      if (filters[element] != null && filters[element] != '')
        finalFilters[element] = filters[element];
    });
  return this.http
      .get(this.backend_url + `/users`, {
        params: finalFilters,
        headers: this.headers,
      })
}

  async addUser(data: any) {
    return firstValueFrom(
      this.http
        .post(this.backend_url + `/users`, data, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    );
  }

  async updateUser(data: any) {
    return firstValueFrom(
      this.http
        .put(this.backend_url + `/users`, data, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    );
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
    if(localStorage.getItem('access_token') as string)
    return jwt_decode(localStorage.getItem('access_token') as string);
    else
    return false;
  }

  async exportUsers(filters: any) {
    let finalFilters: any = {};
    if (filters)
      Object.keys(filters).forEach((element) => {
        if (typeof filters[element] === 'string')
          filters[element] = filters[element].trim();

        if (filters[element] != null && filters[element] != '')
          finalFilters[element] = filters[element];
      });
    const data: any = await firstValueFrom(
      this.http
        .get(this.backend_url + '/users/export/all', {
          params: finalFilters,
          headers: this.headers,
          responseType: 'blob',
        })
        .pipe(map((d: Blob) => d))
    );
    saveAs(data, 'Users-all.xlsx');
  }
}
