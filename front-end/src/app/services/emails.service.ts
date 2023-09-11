import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class EmailsService extends MainService {

  constructor(private http: HttpClient) { 
    super();
   }
  // get headers() {
  //   return {
  //     'content-type': 'application/json',
  //     'authorization': 'Bearer ' + localStorage.getItem('access_token'),
  //   }
  // }

  async getEmails( 
    filters: any = null,
    page: number,
    limit: number,
  ) {
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
          .get(this.backend_url + `/emails?page=${page}&limit=${limit}`, {
            params: finalFilters,
            headers: this.headers,
          })
          .pipe(map((d) => d))
      ).catch((e) => false);  }

  filterSearchEmails(
    search: string,
  ) {
    return this.http.get<any>(environment.backend_url + "/emails/filter-search?search=" + search, { headers: this.headers }).toPromise();
  }

  filterStatusEmails(
    status: boolean,
  ) {
    return this.http.get<any>(environment.backend_url + "/emails/filter-status?status=" + status, { headers: this.headers }).toPromise();
  }
}
