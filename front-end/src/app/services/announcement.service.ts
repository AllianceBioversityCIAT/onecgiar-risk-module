import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService extends MainService {

  constructor(private http: HttpClient) {
    super();
  }

  addAnnouncement(data:any): Observable<any> {
    const url = this.backend_url + '/announcement';
    return this.http.post(url, data, this.headers);
  }

  getAnnouncement(): Observable<any> {
    const url = this.backend_url + '/announcement';
    return this.http.get(url, this.headers);
  }

  getAnnouncementById(id: number): Observable<any> {
    const url = this.backend_url + `/announcement/${id}`;
    return this.http.get(url, this.headers);
  }

  updateAnnouncement(id: any, data: any): Observable<any> {
    const url = this.backend_url + `/announcement/${id}`;
    return this.http.put(url, data ,this.headers);
  }

  updateAnnouncementStatus(id: any, status: any): Observable<any> {
    const data = {status: status};
    const url = this.backend_url + `/announcement/${id}`;
    return this.http.patch(url, data ,this.headers);
  }
}
