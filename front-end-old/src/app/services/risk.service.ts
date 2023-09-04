import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root',
})
export class RiskService extends MainService {
  constructor(private http: HttpClient) {
    super();
  }
  updateRedundant(iniitave_id: number, redundant: number) {
    return firstValueFrom(
      this.http
        .patch(
          this.backend_url + '/risk/' + iniitave_id + '/redundant',
          { redundant },
          {
            headers: this.headers,
          }
        )
        .pipe(map((d: any) => d))
    );
  }

  getRisk(riskId: number) {
    return this.http
      .get(this.backend_url + '/risk/' + riskId, { headers: this.headers })
      .toPromise();
  }
  getRisks(initiative_id: number, filters: any = null) {

    let finalFilters: any = {};
    if(filters)
    Object.keys(filters).forEach((element) => {
      if (typeof filters[element] === 'string')
        filters[element] = filters[element].trim();

      if (filters[element] != null && filters[element] != '')
        finalFilters[element] = filters[element];
    });
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/risk', {
          params: { initiative_id, ...finalFilters },
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }
  deleteRisk(riskId: number, initiative_id: any = null) {
    return firstValueFrom(
      this.http.delete(this.backend_url + '/risk/' + riskId + '/init_id/' + initiative_id, {
        headers: this.headers,
      })
    );
  }
  // ============================================================================= RISK  --  PUT API
  async updateRisk(riskId: number, risk: any) {
    return firstValueFrom(
      this.http
        .put(this.backend_url + '/risk/' + riskId, risk, {
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }
  // ============================================================================= RISK  --  PUT API
  getRiskMitigations(riskId: number) {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/risk/' + riskId + '/mitigation', {
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }
  createNewRisk(newRisk: any) {
    return firstValueFrom(
      this.http
        .post(this.backend_url + '/risk', newRisk, { headers: this.headers })
        .pipe(map((d: any) => d))
    );
  }

  createNewMitigation(riskId: number, newMitigation: any) {
    return this.http
      .post(
        this.backend_url + '/risk/' + riskId + '/mitigation',
        {
          risk_id: newMitigation.risk_id,
          description: newMitigation.description,
          status: newMitigation.status,
        },
        { headers: this.headers }
      )
      .toPromise();
  }
  editMitigation(riskId: number, mitigationId: number, newMitigation: any) {
    return this.http
      .put(
        this.backend_url + '/risk/' + riskId + '/mitigation/' + mitigationId,
        {
          risk_id: newMitigation.risk_id,
          description: newMitigation.description,
          status: newMitigation.status,
          id: mitigationId,
        },
        { headers: this.headers }
      )
      .toPromise();
  }
  deleteMitigation(riskId: number, mitigationId: number) {
    return this.http
      .delete(
        this.backend_url + '/risk/' + riskId + '/mitigation/' + mitigationId,
        { headers: this.headers }
      )
      .toPromise();
  }

  getRiskCategories() {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/risk-categories', { headers: this.headers })
        .pipe(map((d) => d))
    );
  }
  getInitiativeCategories(id:number) {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/initiative/'+id+'/categories', { headers: this.headers })
        .pipe(map((d) => d))
    );
  }
  getInitiativesCategories() {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/initiative/all/categories', { headers: this.headers })
        .pipe(map((d) => d))
    );
  }
  getRiskUsers(id: number) {
    return firstValueFrom(
      this.http
        .get(this.backend_url + `/initiative/${id}/roles`, {
          headers: this.headers,
        })
        .pipe(map((d) => d))
    );
  }
}
