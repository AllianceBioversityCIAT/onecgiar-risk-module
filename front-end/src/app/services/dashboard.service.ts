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
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/initiative/score', this.headers).pipe(map(d=>d))).catch((e) => false);
  }
  async details() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/initiative/details', this.headers).pipe(map(d=>d))).catch((e) => false);
  }
  async categoriesLevels() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/categories/levels', this.headers).pipe(map(d=>d))).catch((e) => false);
  }
  async categoriesCount() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/categories/count', this.headers).pipe(map(d=>d))).catch((e) => false);
  }
  async category_groups() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/categories/groups/count', this.headers).pipe(map(d=>d))).catch((e) => false);
  }
  async actionAreas() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/action_areas/count', this.headers).pipe(map(d=>d))).catch((e) => false);
  }
  async status() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/status', this.headers).pipe(map(d=>d))).catch((e) => false);
  }
}