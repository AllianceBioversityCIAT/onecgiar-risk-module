import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends MainService {

  constructor(private http: HttpClient) {
    super();
  }

  async current() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard', this.headers).pipe(map(d=>d))).catch((e) => false);
  }
  async categories() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/categories', this.headers).pipe(map(d=>d))).catch((e) => false);
  }

  async status() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/status', this.headers).pipe(map(d=>d))).catch((e) => false);
  }
}