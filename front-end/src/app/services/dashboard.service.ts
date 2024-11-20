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
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/science-programs/score', {headers: this.headers}).pipe(map(d=>d))).catch((e) => false);
  }
  async details() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/science-programs/details', {headers: this.headers}).pipe(map(d=>d))).catch((e) => false);
  }
  async categoriesLevels() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/categories/levels', {headers: this.headers}).pipe(map(d=>d))).catch((e) => false);
  }
  async categoriesCount() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/categories/count', {headers: this.headers}).pipe(map(d=>d))).catch((e) => false);
  }
  async category_groups() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/categories/groups/count', {headers: this.headers}).pipe(map(d=>d))).catch((e) => false);
  }
  async actionAreas() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/action_areas/count', {headers: this.headers}).pipe(map(d=>d))).catch((e) => false);
  }
  async status() {
    return firstValueFrom(this.http.get(this.backend_url + '/dashboard/status', {headers: this.headers}).pipe(map(d=>d))).catch((e) => false);
  }
  async riskDashboardData(initiative_id: any) {
    return firstValueFrom(this.http.get(this.backend_url + `/dashboard/risks/${initiative_id}`, {headers: this.headers}).pipe(map(d=>d))).catch((e) => false);
  }
}