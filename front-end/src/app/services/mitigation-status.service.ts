import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MitigationStatusService extends MainService{

  constructor(private http: HttpClient) {
    super();
  }

  async addMitigationStatus(data:any) {
    return firstValueFrom(this.http.post(this.backend_url + `/mitigation-status`,data, {headers: this.headers,}).pipe(map((d) => d))).catch((e) => false);
  }

  async getMitigationStatus() {
    return firstValueFrom(this.http.get(this.backend_url + '/mitigation-status',{headers: this.headers}).pipe(map(d=>d))).catch((e) => false);
  }

  async getMitigationStatusById(id: number) {
    return firstValueFrom(this.http.get(this.backend_url + `/mitigation-status/${id}`, {headers: this.headers,}).pipe(map(d=>d))).catch((e) => false);
  }

  async updateMitigationStatus(id: any, data: any) {
    return firstValueFrom(this.http.put(this.backend_url + `/mitigation-status/${id}`, data ,{headers: this.headers,}).pipe(map(d=>d))).catch((e) => false);
  }

  async deleteMitigationStatus(id: any) {
    return firstValueFrom(this.http.delete(this.backend_url + `/mitigation-status/${id}`, {headers: this.headers,}).pipe(map(d=>d))).catch((e) => false);
  }
}
