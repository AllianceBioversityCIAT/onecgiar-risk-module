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

  async getPhases() {
    return firstValueFrom(
      this.http.get('api/phases', {headers: this.headers}).pipe(map((d: any) => d))
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
