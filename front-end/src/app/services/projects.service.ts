import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainService } from './main.service';
import { firstValueFrom, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectsService extends MainService {
  constructor(private http: HttpClient) {
    super();
  }

  getAll() {
    return firstValueFrom(
      this.http
        .get<any[]>(this.backend_url + '/program', { headers: this.headers })
        .pipe(map((d) => d))
    );
  }

  create(data: { official_code: string; name: string; isProject: boolean }) {
    return firstValueFrom(
      this.http
        .post(this.backend_url + '/program', data, { headers: this.headers })
        .pipe(map((d) => d))
    );
  }

  update(
    id: number,
    data: { official_code: string; name: string; isProject: boolean }
  ) {
    return firstValueFrom(
      this.http
        .put(this.backend_url + `/program/${id}`, data, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    );
  }

  delete(id: number) {
    return firstValueFrom(
      this.http
        .delete(this.backend_url + `/program/${id}`, { headers: this.headers })
        .pipe(map((d) => d))
    );
  }
}
