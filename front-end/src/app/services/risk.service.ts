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
  getRisks(iniitave_id: number) {
    return firstValueFrom(
      this.http
        .get(this.backend_url + '/risk/' + iniitave_id, {
          headers: this.headers,
        })
        .pipe(map((d: any) => d))
    );
  }
  deleteRisk(riskId: number) {
    return this.http
      .delete(this.backend_url + '/risk/' + riskId, { headers: this.headers })
      .toPromise();
  }
  // ============================================================================= RISK  --  PUT API
  async updateRisk(riskId: number, risk: any) {
    return this.http
      .put(this.backend_url + '/risk/' + riskId, risk, {
        headers: this.headers,
      })
      .toPromise();
  }
  // ============================================================================= RISK  --  PUT API
  getRiskMitigations(riskId: number) {
    return this.http
      .get(this.backend_url + '/risk/' + riskId + '/mitigation', {
        headers: this.headers,
      })
      .toPromise();
  }
  createNewRisk(newRisk: any) {
    console.log(newRisk);
    return this.http
      .post(this.backend_url + '/risk', newRisk, { headers: this.headers })
      .toPromise();
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
    return this.http
      .get(this.backend_url + '/risk-categories', { headers: this.headers })
      .toPromise();
  }
}
