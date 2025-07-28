import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends MainService {
  constructor(private http: HttpClient) {
    super();
  }

  private withProjectParam(isProject: number): {
    headers: any;
    params: HttpParams;
  } {
    const params = new HttpParams().set('isProject', isProject.toString());
    return { headers: this.headers, params };
  }

  /** score chart (current+target) */
  async current(isProject: number) {
    return firstValueFrom(
      this.http.get<any[]>(
        this.backend_url + '/dashboard/program/score',
        this.withProjectParam(isProject)
      )
    ).catch(() => []); // <<< return empty array on error
  }

  /** summary table under “Risk details” */
  async details(isProject: number) {
    return firstValueFrom(
      this.http.get<any[]>(
        this.backend_url + '/dashboard/program/details',
        this.withProjectParam(isProject)
      )
    ).catch(() => []);
  }

  /** average risk by action area */
  async categoriesLevels(isProject: number) {
    return firstValueFrom(
      this.http.get<any[]>(
        this.backend_url + '/dashboard/categories/levels',
        this.withProjectParam(isProject)
      )
    ).catch(() => []);
  }

  /** pie: count per risk category */
  async categoriesCount(isProject: number) {
    return firstValueFrom(
      this.http.get<any[]>(
        this.backend_url + '/dashboard/categories/count',
        this.withProjectParam(isProject)
      )
    ).catch(() => []);
  }

  /** pie: count per category group */
  async category_groups(isProject: number) {
    return firstValueFrom(
      this.http.get<any[]>(
        this.backend_url + '/dashboard/categories/groups/count',
        this.withProjectParam(isProject)
      )
    ).catch(() => []);
  }

  /** pie/column: actions by status */
  async actionAreas(isProject: number) {
    return firstValueFrom(
      this.http.get<any[]>(
        this.backend_url + '/dashboard/action_areas/count',
        this.withProjectParam(isProject)
      )
    ).catch(() => []);
  }

  /** pie/column: status of actions */
  async status(isProject: number) {
    return firstValueFrom(
      this.http.get<any[]>(
        this.backend_url + '/dashboard/status',
        this.withProjectParam(isProject)
      )
    ).catch(() => []);
  }

  /** legacy: fetch all risks for one initiative */
  async riskDashboardData(initiative_id: any) {
    return firstValueFrom(
      this.http.get<any[]>(
        this.backend_url + `/dashboard/risks/${initiative_id}`,
        { headers: this.headers }
      )
    ).catch(() => []);
  }
}
