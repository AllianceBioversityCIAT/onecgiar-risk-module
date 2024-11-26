import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';
import { saveAs } from 'file-saver';
import { MainService } from './main.service';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root',
})
export class InitiativesService extends MainService {
  constructor(private http: HttpClient, private userService: UserService) {
    super();
  }

  async getExport(filters: any) { 
    const userInfo = this.userService.getLogedInUser();
    let finalFilters: any = {};
    Object.keys(filters).forEach((element) => {
      if (typeof filters[element] === 'string')
        filters[element] = filters[element].trim();
      if (filters[element] != null && filters[element] != '')
        finalFilters[element] = filters[element];
    });

    const data = await firstValueFrom(
      this.http
        .get(this.backend_url + `/program/all/excel?user=${userInfo.role}`, {
          params: finalFilters,
          headers: this.headers,
          responseType: 'blob',
        })
        .pipe(map((d: Blob) => d))
    );
    saveAs(data, 'All-Risks.xlsx');
  }



  async exportArchivedRisks(filters: any) { 
    const data = await firstValueFrom(
      this.http
        .get(this.backend_url + `/program/export-archived`, {
          params: filters,
          headers: this.headers,
          responseType: 'blob',
        })
        .pipe(map((d: Blob) => d))
    );
    saveAs(data, 'Risks-archived-' + filters.versionId + '.xlsx');
  }

  async Publish(id: number, reason: any) {
    return await firstValueFrom(
      this.http
        .post(
          this.backend_url + '/program/' + id + '/create_version',
          reason,
          {
            headers: this.headers,
          }
        )
        .pipe(map((d: any) => d))
    );
  }

  async archiveInit(initIds: number []) {
    return await firstValueFrom(
      this.http
        .post(
          this.backend_url + '/program/archive',
          {
            ids: initIds
          },
          {
            headers: this.headers,
          }
        )
        .pipe(map((d: any) => d))
    );
  }

  async syncInit(initIds: number []) {
    return await firstValueFrom(
      this.http
        .post(
          this.backend_url + '/program/sync-clarisa',
          {
            ids: initIds
          },
          {
            headers: this.headers,
          }
        )
        .pipe(map((d: any) => d))
    );
  }
  async getExportByinititave(id: number, official_code = '', versions: boolean, filters: any) {
    const userInfo = this.userService.getLogedInUser();
    let finalFilters: any = {};
    Object.keys(filters).forEach((element) => {
      if (typeof filters[element] === 'string')
        filters[element] = filters[element].trim();
      if (filters[element] != null && filters[element] != '')
        finalFilters[element] = filters[element];
    });

    const data = await firstValueFrom(
      this.http
        .get(this.backend_url + '/program/' + id + `/excel?user=${userInfo.role}&version=${versions}`, {
          params: finalFilters,
          headers: this.headers,
          responseType: 'blob',
        })
        .pipe(map((d: Blob) => d))
    );
    saveAs(data, 'Risks-' + official_code + '.xlsx');
  }
  async getInitiatives(id = null): Promise<Array<any>> {
    if (id)
      return await firstValueFrom(
        this.http
          .get(this.backend_url + '/program/' + id + '/versions', {
            headers: this.headers,
          })
          .pipe(map((d: any) => d))
      );
    else
      return await firstValueFrom(
        this.http
          .get(this.backend_url + '/program', {
            headers: this.headers,
          })
          .pipe(map((d: any) => d))
      );
  }

  async getInitiativesWithFilters(filters: any) {
    let finalFilters: any = {};
    if(filters)
      Object.keys(filters).forEach((element) => {
        if (typeof filters[element] === 'string')
          filters[element] = filters[element].trim();

        if (filters[element] != null)
          finalFilters[element] = filters[element];
      });
    return await firstValueFrom(
      this.http
        .get(this.backend_url + '/program/', {
          params: finalFilters,
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }


  async getArchivedInitiatives(filters: any) {
    let finalFilters: any = {};
    if(filters)
      Object.keys(filters).forEach((element) => {
        if (typeof filters[element] === 'string')
          filters[element] = filters[element].trim();

        if (filters[element] != null && filters[element] != '')
          finalFilters[element] = filters[element];
      });
    return await firstValueFrom(
      this.http
        .get(this.backend_url + '/program/archived', {
          params: finalFilters,
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }

  getArchivedById(archivedId: number): Promise<any> {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/program/archived/' + archivedId , {
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }

  getInitiativeLatestVersion(initiativeId: number): Promise<any> {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/program/' + initiativeId+'/versions/latest', {
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }


  getTopRisks(initiativeId: number): Promise<any> {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/program/' + initiativeId+'/top', {
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }

  getInitiative(initiativeId: number): Promise<any> {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/program/' + initiativeId, {
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }

  getInitiativeForVersion(initiativeId: number, filter: any): Promise<any> {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/program/version/' + initiativeId, {
          params: filter,
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }
  // roles
  getInitiativeRoles(initiativeId: number) {
    return this.http
      .get(this.backend_url + '/program/' + initiativeId + '/roles', {
        headers: this.headers,
      })
      .toPromise();
  }

  createNewInitiativeRole(initiativeId: number, role: any): Observable<any>{
    return this.http
      .post<any>(
        this.backend_url + '/program/' + initiativeId + '/roles',
        {
          initiative_id: role.initiative_id,
          email: role.email,
          user_id: role.user_id,
          role: role.role,
        },
        { headers: this.headers }
      )
  }

  updateInitiativeRole(initiativeId: number, roleId: number, role: any) {
    return this.http
      .put(
        this.backend_url + '/program/' + initiativeId + '/roles/' + roleId,
        {
          initiative_id: role.initiative_id,
          id: role.id,
          email: role.email,
          user_id: role.user_id,
          role: role.role,
        },
        { headers: this.headers }
      )
  }

  deleteInitiativeRole(initiativeId: number, roleId: number) {
    return this.http
      .delete(
        this.backend_url + '/program/' + initiativeId + '/roles/' + roleId,
        { headers: this.headers }
      )
      .toPromise();
  }
}
