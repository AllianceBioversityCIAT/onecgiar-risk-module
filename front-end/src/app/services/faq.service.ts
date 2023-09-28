import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FAQService extends MainService {

  constructor(private http: HttpClient) {
    super();
  }


  async createFaq(data: any) {
    return firstValueFrom(
      this.http
        .post(this.backend_url + '/faq', data, {headers: this.headers})
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async getData(filters: any = null, page: any, limit: any) {
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
        .get(this.backend_url + `/faq?page=${page}&limit=${limit}`, {headers: this.headers, params: finalFilters})
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async getFaqById(id: number) {
    return firstValueFrom(
      this.http
        .get(this.backend_url + `/faq/${id}`, {headers: this.headers})
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async editFaq(id: any, data: any) {
    return firstValueFrom(
      this.http
        .put(this.backend_url + `/faq/${id}`, data, {headers: this.headers})
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async deleteFaq(id:any) {
    return firstValueFrom(
      this.http
        .delete(this.backend_url + `/faq/${id}`, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }
}
