import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root',
})
export class PhasesService extends MainService {
  constructor(private http: HttpClient) {
    super();
  }

  async getPhases(filters: any = null, page: any, limit: any) {
    let finalFilters: any = {};
    if (filters)
      Object.keys(filters).forEach((element) => {
        if (typeof filters[element] === 'string')
          filters[element] = filters[element].trim();

        if (filters[element] != null && filters[element] != '')
          finalFilters[element] = filters[element];
      });
    return firstValueFrom(
      this.http.get(`${this.backend_url}/phases?page=${page}&limit=${limit}`, {headers: this.headers, params: finalFilters}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getPhase(id: number) {
    return firstValueFrom(
      this.http.get(this.backend_url+'/phases/' + id, {headers: this.headers}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitPhase(id: number = 0, data: {}) {
    if (id) {
      return firstValueFrom(
        this.http.patch(this.backend_url+'/phases/' + id, data, {headers: this.headers}).pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      return firstValueFrom(
        this.http.post(this.backend_url+'/phases', data, {headers: this.headers}).pipe(map((d: any) => d))
      ).catch((e) => false);
    }
  }

  deletePhase(id: number) {
    return firstValueFrom(
      this.http.delete(this.backend_url+'/phases/' + id, {headers: this.headers}).pipe(map((d: any) => d))
    );
  }

  activatePhase(id: number) {
    return firstValueFrom(
      this.http.get(this.backend_url+'/phases/activate/' + id, {headers: this.headers}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  deactivatePhase(id: number) {
    return firstValueFrom(
      this.http.get(this.backend_url+'/phases/deactivate/' + id, {headers: this.headers}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  getLastSubmitionVersionByPhase(id: number) {
    return firstValueFrom(
      this.http.get(this.backend_url+'/phases/lastsubmitionversion/' + id, {headers: this.headers}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
}
