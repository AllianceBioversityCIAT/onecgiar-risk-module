import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MitigationStatusService extends MainService{

  constructor(private http: HttpClient) {
    super();
  }

  addMitigation(data:any): Observable<any> {
    const url = this.backend_url + '/mitigation-status';
    return this.http.post(url, data, this.headers);
  }

  getMitigation(){
    const url = this.backend_url + '/mitigation-status';
    return firstValueFrom(this.http.get(url, this.headers).pipe(map(d=>d))) ;
  }

  getMitigationById(id: number): Observable<any> {
    const url = this.backend_url + `/mitigation-status/${id}`;
    return this.http.get(url, this.headers);
  }

  updateMitigation(id: any, data: any): Observable<any> {
    const url = this.backend_url + `/mitigation-status/${id}`;
    return this.http.put(url, data ,this.headers);
  }

  deleteMitigation(id: any): Observable<any> {
    const url = this.backend_url + `/mitigation-status/${id}`;
    return this.http.delete(url, this.headers);
  }
}
