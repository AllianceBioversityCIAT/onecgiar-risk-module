import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlossaryService extends MainService {

  constructor(private http: HttpClient) {
    super();
  }


  async addGlossary(data: any) {
    return firstValueFrom(
      this.http
        .post(this.backend_url + '/glossary', data, {headers: this.headers})
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async getGlossary(filters: any = null, page: any = null, limit: any = null) {
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
        .get(this.backend_url + `/glossary?page=${page}&limit=${limit}`, {
          headers: this.headers,
           params: finalFilters})
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async getGlossaryById(id: number) {
    return firstValueFrom(
      this.http
        .get(this.backend_url + `/glossary/${id}`, {headers: this.headers})
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async updateGlossary(id: any, data: any) {
    return firstValueFrom(
      this.http
        .put(this.backend_url + `/glossary/${id}`, data, {headers: this.headers})
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async deleteGlossary(id:any) {
    return firstValueFrom(
      this.http
        .delete(this.backend_url + `/glossary/${id}`, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }
}
