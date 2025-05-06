// import { Injectable } from '@angular/core';
// import { MainService } from './main.service';
// import { HttpClient } from '@angular/common/http';
// import { Observable, firstValueFrom, map } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class DashboardService extends MainService {
//   constructor(private http: HttpClient) {
//     super();
//   }

//   async current() {
//     return firstValueFrom(
//       this.http
//         .get(this.backend_url + '/dashboard/program/score', {
//           headers: this.headers,
//         })
//         .pipe(map((d) => d))
//     ).catch((e) => false);
//   }
//   async details() {
//     return firstValueFrom(
//       this.http
//         .get(this.backend_url + '/dashboard/program/details', {
//           headers: this.headers,
//         })
//         .pipe(map((d) => d))
//     ).catch((e) => false);
//   }
//   async categoriesLevels() {
//     return firstValueFrom(
//       this.http
//         .get(this.backend_url + '/dashboard/categories/levels', {
//           headers: this.headers,
//         })
//         .pipe(map((d) => d))
//     ).catch((e) => false);
//   }
//   async categoriesCount() {
//     return firstValueFrom(
//       this.http
//         .get(this.backend_url + '/dashboard/categories/count', {
//           headers: this.headers,
//         })
//         .pipe(map((d) => d))
//     ).catch((e) => false);
//   }
//   async category_groups() {
//     return firstValueFrom(
//       this.http
//         .get(this.backend_url + '/dashboard/categories/groups/count', {
//           headers: this.headers,
//         })
//         .pipe(map((d) => d))
//     ).catch((e) => false);
//   }
//   async actionAreas() {
//     return firstValueFrom(
//       this.http
//         .get(this.backend_url + '/dashboard/action_areas/count', {
//           headers: this.headers,
//         })
//         .pipe(map((d) => d))
//     ).catch((e) => false);
//   }
//   async status() {
//     return firstValueFrom(
//       this.http
//         .get(this.backend_url + '/dashboard/status', { headers: this.headers })
//         .pipe(map((d) => d))
//     ).catch((e) => false);
//   }
//   async riskDashboardData(initiative_id: any) {
//     return firstValueFrom(
//       this.http
//         .get(this.backend_url + `/dashboard/risks/${initiative_id}`, {
//           headers: this.headers,
//         })
//         .pipe(map((d) => d))
//     ).catch((e) => false);
//   }
// }

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

  private buildParams(isProject?: number): HttpParams {
    let params = new HttpParams();
    if (isProject !== undefined) {
      params = params.set('isProject', isProject.toString());
    }
    return params;
  }

  async current(isProject?: number) {
    const params = this.buildParams(isProject);
    return firstValueFrom(
      this.http
        .get<any[]>(`${this.backend_url}/dashboard/program/score`, {
          headers: this.headers,
          params,
        })
        .pipe(map((d) => d))
    ).catch(() => []); // ← return [] instead of false
  }

  async details(isProject?: number) {
    const params = this.buildParams(isProject);
    return firstValueFrom(
      this.http
        .get<any[]>(`${this.backend_url}/dashboard/program/details`, {
          headers: this.headers,
          params,
        })
        .pipe(map((d) => d))
    ).catch(() => []);
  }

  async categoriesLevels(isProject?: number) {
    const params = this.buildParams(isProject);
    return firstValueFrom(
      this.http
        .get<any[]>(`${this.backend_url}/dashboard/categories/levels`, {
          headers: this.headers,
          params,
        })
        .pipe(map((d) => d))
    ).catch(() => []);
  }

  async categoriesCount(isProject?: number) {
    const params = this.buildParams(isProject);
    return firstValueFrom(
      this.http
        .get<any[]>(`${this.backend_url}/dashboard/categories/count`, {
          headers: this.headers,
          params,
        })
        .pipe(map((d) => d))
    ).catch(() => []);
  }

  async category_groups(isProject?: number): Promise<any[]> {
    const params = this.buildParams(isProject);
    return firstValueFrom(
      this.http
        .get<any[]>(this.backend_url + '/dashboard/categories/groups/count', {
          headers: this.headers,
          params,
        })
        .pipe(map((d) => d))
    ).catch(() => []); // ← return empty array on error
  }

  async actionAreas(isProject?: number) {
    const params = this.buildParams(isProject);
    return firstValueFrom(
      this.http
        .get<any[]>(`${this.backend_url}/dashboard/action_areas/count`, {
          headers: this.headers,
          params,
        })
        .pipe(map((d) => d))
    ).catch(() => []);
  }

  async status(isProject?: number) {
    const params = this.buildParams(isProject);
    return firstValueFrom(
      this.http
        .get<any[]>(`${this.backend_url}/dashboard/status`, {
          headers: this.headers,
          params,
        })
        .pipe(map((d) => d))
    ).catch(() => []);
  }

  async riskDashboardData(initiative_id: any) {
    return firstValueFrom(
      this.http
        .get<any>(`${this.backend_url}/dashboard/risks/${initiative_id}`, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    ).catch(() => null);
  }
}
