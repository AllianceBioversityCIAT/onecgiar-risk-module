import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainService } from '../services/main.service';
import { firstValueFrom, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectsService extends MainService {
  constructor(private http: HttpClient) {
    super();
  }

  getProjects() {
    return firstValueFrom(
      this.http
        .get(`${this.backend_url}/program/projects`, { headers: this.headers })
        .pipe(map((d: any) => d))
    );
  }

  createProject(data: any) {
    return firstValueFrom(
      this.http
        .post(`${this.backend_url}/program/projects`, data, {
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }

  updateProject(id: number, data: any) {
    return firstValueFrom(
      this.http
        .put(`${this.backend_url}/program/projects/${id}`, data, {
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }

  deleteProject(id: number) {
    return firstValueFrom(
      this.http
        .delete(`${this.backend_url}/program/projects/${id}`, {
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }
}
