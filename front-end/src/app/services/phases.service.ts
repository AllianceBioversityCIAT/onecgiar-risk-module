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
      this.http.get(`api/phases?page=${page}&limit=${limit}`, {headers: this.headers, params: finalFilters}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getPhase(id: number) {
    return firstValueFrom(
      this.http.get('api/phases/' + id, {headers: this.headers}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitPhase(id: number = 0, data: {}) {
    if (id) {
      return firstValueFrom(
        this.http.patch('api/phases/' + id, data, {headers: this.headers}).pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      return firstValueFrom(
        this.http.post('api/phases', data, {headers: this.headers}).pipe(map((d: any) => d))
      ).catch((e) => false);
    }
  }

  deletePhase(id: number) {
    return firstValueFrom(
      this.http.delete('api/phases/' + id, {headers: this.headers}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  getTocPhases() {
    return firstValueFrom(
      this.http
        .get('https://toc.loc.codeobia.com/api/phases', {headers: this.headers})
        .pipe(map((d: any) => d.data))
    ).catch((e) => false);
  }

  activatePhase(id: number) {
    return firstValueFrom(
      this.http.get('api/phases/activate/' + id, {headers: this.headers}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  deactivatePhase(id: number) {
    return firstValueFrom(
      this.http.get('api/phases/deactivate/' + id, {headers: this.headers}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
}
