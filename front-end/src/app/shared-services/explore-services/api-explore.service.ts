import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MainService } from 'src/app/services/main.service';

export interface ExploreProgram {
  id: number;
  official_code: string;
  name: string;
  risk_count: number;
  total_actions: number;
  avg_current_level: number;
  avg_target_level: number;
  submit_date?: string;
  organizations?: ExploreOrganization[];
}

export interface ExploreOrganization {
  id: number;
  name: string;
  acronym?: string;
}

export interface ExploreRisk {
  id: number;
  title: string;
  description: string;
  current_likelihood: number;
  current_impact: number;
  target_likelihood: number;
  target_impact: number;
  due_date: string;
  category?: {
    id: number;
    title: string;
    category_group?: {
      id: number;
      name: string;
    };
  };
  risk_owner?: {
    user?: {
      full_name: string;
      email: string;
    };
    email?: string;
  };
  mitigations?: ExploreMitigation[];
}

export interface ExploreMitigation {
  id: number;
  description: string;
  status?: {
    id: number;
    title: string;
  };
}

export interface ExploreProgramDetail {
  id: number;
  official_code: string;
  name: string;
  status: boolean;
  narrative?: string;
  submit_date?: string;
  phase?: { id: number; name: string };
  organizations?: ExploreOrganization[];
  roles?: ExploreProgramRole[];
  risks?: ExploreRisk[];
}

export interface ExploreProgramRole {
  id: number;
  role: string;
  user?: {
    full_name: string;
    email: string;
  };
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiExploreService extends MainService {
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Retrieves all programs visible on the public explore page.
   * @param search Optional search term to filter by name or code
   */
  getPrograms(search?: string): Observable<ExploreProgram[]> {
    const params: any = {};
    if (search && search.trim()) {
      params['search'] = search.trim();
    }
    return this.http
      .get<ExploreProgram[]>(this.backend_url + '/explore/programs', {
        params,
        headers: this.headers,
      })
      .pipe(map((d: any) => d));
  }

  /**
   * Retrieves the latest submitted version detail for a single program.
   * @param official_code The official code of the program (e.g. "INIT-01")
   */
  getProgramByCode(official_code: string, version_id?: string): Observable<ExploreProgramDetail> {
    let url = this.backend_url + '/explore/programs/' + official_code;
    if (version_id) {
      url += '/' + version_id;
    }
    return this.http
      .get<ExploreProgramDetail>(url, { headers: this.headers })
      .pipe(map((d: any) => d));
  }
}
