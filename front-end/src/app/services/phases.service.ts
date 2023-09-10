import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PhasesService {
  constructor(private http: HttpClient) {}

  async getPhases() {
    return firstValueFrom(
      this.http.get("api/phases").pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getPhase(id: number) {
    return firstValueFrom(
      this.http.get("api/phases/" + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitPhase(id: number = 0, data: {}) {
    if (id) {
      return firstValueFrom(
        this.http.patch("api/phases/" + id, data).pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      return firstValueFrom(
        this.http.post("api/phases", data).pipe(map((d: any) => d))
      ).catch((e) => false);
    }
  }

  deletePhase(id: number) {
    return firstValueFrom(
      this.http.delete("api/phases/" + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  getTocPhases() {
    return firstValueFrom(
      this.http
        .get("https://toc.loc.codeobia.com/api/phases")
        .pipe(map((d: any) => d.data))
    ).catch((e) => false);
  }
}
