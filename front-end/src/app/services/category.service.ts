import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { MainService } from './main.service';
import { saveAs } from 'file-saver';
@Injectable({
  providedIn: 'root',
})
export class CategoryService extends MainService {
  constructor(private http: HttpClient) {
    super();
  }



  async getCategories(filters: any = null, page: number, limit: number) {
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
        .get(this.backend_url + `/risk-categories?page=${page}&limit=${limit}`, {
          params: finalFilters,
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async addCategory(data:any) {
    return firstValueFrom(
      this.http
        .post(this.backend_url + `/risk-categories`,data, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async updateCategory(data:any) {
    return firstValueFrom(
      this.http
        .put(this.backend_url + `/risk-categories`,data, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async disableCategory(data:any) {
    return firstValueFrom(
      this.http
        .patch(this.backend_url + `/risk-categories`,data, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async deleteCategory(id:any) {
    return firstValueFrom(
      this.http
        .delete(this.backend_url + `/risk-categories/${id}`, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }
  async exportCategories() {
    const data:any = await firstValueFrom(
      this.http
        .get(this.backend_url + '/risk-categories/export/all', {
          headers: this.headers,
          responseType: 'blob',
        })
        .pipe(map((d: Blob) => d))
    );
    saveAs(data, 'Categories-all.xlsx');
  }
}
