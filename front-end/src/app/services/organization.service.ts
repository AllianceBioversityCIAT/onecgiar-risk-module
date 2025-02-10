import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends MainService {

  constructor(private http: HttpClient) {
    super();
  }

  async getOrganizations(filters: any = null, page: any, limit: any) {
    let finalFilters: any = {};
    if (filters)
      Object.keys(filters).forEach((element) => {
        if (typeof filters[element] === "string")
          filters[element] = filters[element].trim();

        if (filters[element] != null && filters[element] != "")
          finalFilters[element] = filters[element];
      });
    return firstValueFrom(
      this.http
        .get(`${this.backend_url}/organizations?page=${page}&limit=${limit}`, { headers: this.headers, params: finalFilters })
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getOrganization(code: string) {
    return firstValueFrom(
      this.http.get(this.backend_url+"/organizations/" + code, {headers: this.headers}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitOrganization(code: string = "0", data: {}) {
    if (code != "0") {
      return firstValueFrom(
        this.http
          .patch(this.backend_url+"/organizations/" + code, data, {headers: this.headers})
          .pipe(map((d: any) => d))
      );
    } else {
      return firstValueFrom(
        this.http.post(this.backend_url+"/organizations", data, {headers: this.headers}).pipe(map((d: any) => d))
      );
    }
  }

  deleteOrganization(id: number) {
    return firstValueFrom(
      this.http.delete(this.backend_url+"/organizations/" + id, {headers: this.headers}).pipe(map((d: any) => d))
    );
  }

  getOrganizationsByProgramId(programId: number) {
    return firstValueFrom(
      this.http.get(this.backend_url+"/organizations/program/" + programId , {headers: this.headers}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }


  assignOrgs(data: any) {
    return firstValueFrom(
      this.http.post(this.backend_url+"/organizations/assign-org/", data, {headers: this.headers}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

}
