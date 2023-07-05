import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService extends MainService {
  constructor(private http: HttpClient) {
    super();
  }

  async addAnnouncement(data: any) {
    return firstValueFrom(
      this.http
        .post(this.backend_url + '/announcement', data, this.headers)
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async getAnnouncement() {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/announcement', this.headers)
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async getAnnouncementById(id: number) {
    return firstValueFrom(
      this.http
        .get(this.backend_url + `/announcement/${id}`, this.headers)
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async updateAnnouncement(id: any, data: any) {
    return firstValueFrom(
      this.http
        .put(this.backend_url + `/announcement/${id}`, data, this.headers)
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  async updateAnnouncementStatus(id: any, status: any) {
    const data = { status: status };
    return firstValueFrom(
      this.http
        .patch(this.backend_url + `/announcement/${id}`, data, this.headers)
        .pipe(map((d) => d))
    ).catch((e) => false);
  }
  async send(id: any) {
    return firstValueFrom(
      this.http
        .post(this.backend_url + `/announcement/${id}/send`, this.headers)
        .pipe(map((d) => d))
    ).catch((e) => false);
  }
  async sendTest(id: any, data: any) {
    return firstValueFrom(
      this.http
        .post(this.backend_url + `/announcement/${id}/send-test`, data, this.headers)
        .pipe(map((d) => d))
    ).catch((e) => false);
  }
}
