import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailsService {

  constructor(private http: HttpClient) { }
  get headers() {
    return {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }
  }

  getEmails( 
    page: number,
    limit: number
  ) {
    return this.http.get<any>(environment.backend_url + '/emails?page=' + page + '&limit=' + limit, { headers: this.headers }).toPromise();
  }

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
