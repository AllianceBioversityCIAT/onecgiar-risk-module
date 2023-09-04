import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesGroupsService extends MainService {

  constructor(private http: HttpClient) {
    super();
  }

  async getCategoriesGroup() {
    return firstValueFrom(
      this.http
        .get(this.backend_url + `/categories-groups`, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }
}
