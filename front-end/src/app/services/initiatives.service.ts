import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root',
})
export class InitiativesService extends MainService {
  constructor(private http: HttpClient) {
    super();
  }

  async getExport() {
    const data = await firstValueFrom(
      this.http
        .get(this.backend_url + '/initiative/all/excel', {
          headers: this.headers,
          responseType: 'blob',
        })
        .pipe(map((d: Blob) => d))
    );
    saveAs(data, 'All-Risks.xlsx');
  }

  async Publish(id: number, reason: any) {
    return await firstValueFrom(
      this.http
        .post(
          this.backend_url + '/initiative/' + id + '/create_version',
          reason,
          {
            headers: this.headers,
          }
        )
        .pipe(map((d: any) => d))
    );
  }
  async getExportByinititave(id: number, official_code = '') {
    const data = await firstValueFrom(
      this.http
        .get(this.backend_url + '/initiative/' + id + '/excel', {
          headers: this.headers,
          responseType: 'blob',
        })
        .pipe(map((d: Blob) => d))
    );
    saveAs(data, 'Risks-' + official_code + '-' + id + '.xlsx');
  }
  async getInitiatives(id = null): Promise<Array<any>> {
    if (id)
      return await firstValueFrom(
        this.http
          .get(this.backend_url + '/initiative/' + id + '/versions', {
            headers: this.headers,
          })
          .pipe(map((d: any) => d))
      );
    else
      return await firstValueFrom(
        this.http
          .get(this.backend_url + '/initiative', {
            headers: this.headers,
          })
          .pipe(map((d: any) => d))
      );
  }

  async getInitiativesWithFilters(filters: any) {
    let finalFilters: any = {};
    Object.keys(filters).forEach((element) => {
      if (typeof filters[element] === 'string')
        filters[element] = filters[element].trim();

      if (filters[element] != null && filters[element] != '')
        finalFilters[element] = filters[element];
    });
    return await firstValueFrom(
      this.http
        .get(this.backend_url + '/initiative/', {
          params: finalFilters,
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }

  getInitiative(initiativeId: number): Promise<any> {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/initiative/' + initiativeId, {
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }

  // roles
  getInitiativeRoles(initiativeId: number) {
    return this.http
      .get(this.backend_url + '/initiative/' + initiativeId + '/roles', {
        headers: this.headers,
      })
      .toPromise();
  }

  createNewInitiativeRole(initiativeId: number, role: any) {
    return this.http
      .post(
        this.backend_url + '/initiative/' + initiativeId + '/roles',
        {
          initiative_id: role.initiative_id,
          email: role.email,
          role: role.role,
        },
        { headers: this.headers }
      )
      .toPromise();
  }

  updateInitiativeRole(initiativeId: number, roleId: number, role: any) {
    return this.http
      .put(
        this.backend_url + '/initiative/' + initiativeId + '/roles/' + roleId,
        {
          initiative_id: role.initiative_id,
          id: role.id,
          email: role.email,
          role: role.role,
        },
        { headers: this.headers }
      )
      .toPromise();
  }

  deleteInitiativeRole(initiativeId: number, roleId: number) {
    return this.http
      .delete(
        this.backend_url + '/initiative/' + initiativeId + '/roles/' + roleId,
        { headers: this.headers }
      )
      .toPromise();
  }
}
