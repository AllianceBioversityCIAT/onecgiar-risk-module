import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VariableService  extends MainService {

  constructor(private http: HttpClient) {
    super();
  }

  getPublishStatus(): Observable<any> {
    const url = this.backend_url + '/variables/system-publish';
    return this.http.get(url, this.headers);
  }

  updatePublishStatus(status: any): Observable<any> {
    const data = {status: status};
    const url = this.backend_url + `/variables/update-system-publish`;
    return this.http.patch(url, data ,this.headers);
  }
}
