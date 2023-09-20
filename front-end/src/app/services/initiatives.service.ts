import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, firstValueFrom, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
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
        .get(this.backend_url + `/initiative/all/excel?user=${userInfo.role}`, {
          params: finalFilters,
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
        .get(this.backend_url + '/initiative/' + id + `/excel?user=${userInfo.role}&version=${versions}`, {
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

  getInitiativeLatestVersion(initiativeId: number): Promise<any> {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/initiative/' + initiativeId+'/versions/latest', {
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }


  getTopRisks(initiativeId: number): Promise<any> {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/initiative/' + initiativeId+'/top', {
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

  getInitiativeForVersion(initiativeId: number, filter: any): Promise<any> {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/initiative/version/' + initiativeId, {
          params: filter,
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

  createNewInitiativeRole(initiativeId: number, role: any): Observable<any>{
    return this.http
      .post<any>(
        this.backend_url + '/initiative/' + initiativeId + '/roles',
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
        this.backend_url + '/initiative/' + initiativeId + '/roles/' + roleId,
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
        this.backend_url + '/initiative/' + initiativeId + '/roles/' + roleId,
        { headers: this.headers }
      )
      .toPromise();
  }
  public reqAssistanceValue = new Subject<any>();

  requestAssistanceValue(value: any) {
      this.reqAssistanceValue.next(value);
  }

}
