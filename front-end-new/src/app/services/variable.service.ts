import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VariableService  extends MainService {

  constructor(private http: HttpClient) {
    super();
  }

  async getPublishStatus() {
    return firstValueFrom(this.http.get(this.backend_url + '/variables/system-publish', {headers: this.headers}).pipe(map(d=>d))).catch((e) => false);
  }

  async updatePublishStatus(status: any) {
    const data = {status: status};
    return firstValueFrom(this.http.patch(this.backend_url + `/variables/update-system-publish`, data ,{headers: this.headers}).pipe(map(d=>d))).catch((e) => false);
  }
}
