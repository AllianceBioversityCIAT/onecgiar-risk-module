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



  async getCategories() {
    return firstValueFrom(
      this.http
        .get(this.backend_url + `/risk-categories`, {
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
