import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService extends MainService {
  constructor(private http: HttpClient) {
    super();
  }

  /** get every Project (isProject = 1) – always returns an array */
  findAll(): Promise<any[]> {
    return firstValueFrom(
      this.http
        .get(`${this.backend_url}/program`, {
          headers: this.headers,
        })
        .pipe(
          map((d: unknown) => {
            // ① if API already gives an array - just return it
            if (Array.isArray(d)) {
              return d;
            }

            // ② If the API wraps the list in an object (e.g. { items: [...] })
            //    adapt the next line to your real field name
            if (d && typeof d === 'object' && 'items' in d) {
              return (d as any).items as any[];
            }

            // ③ Anything else → treat as “no data”
            return [];
          })
        )
    ).catch(() => []); // network / HTTP error => empty list
  }

  /** create a new Project */
  create(data: any): Promise<any> {
    return firstValueFrom(
      this.http.post(`${this.backend_url}/program`, data, {
        headers: this.headers,
      })
    );
  }

  /** update a Project */
  update(id: number, data: any): Promise<any> {
    return firstValueFrom(
      this.http.put(`${this.backend_url}/program/${id}`, data, {
        headers: this.headers,
      })
    );
  }

  /** delete a Project */
  remove(id: number): Promise<any> {
    return firstValueFrom(
      this.http.delete(`${this.backend_url}/program/${id}`, {
        headers: this.headers,
      })
    );
  }
}
