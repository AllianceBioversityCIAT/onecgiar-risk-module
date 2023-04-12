import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InitiativesService {


  backend_url= environment.backend_url;
  constructor(private http: HttpClient) {

  }

  get headers() {
    return {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + localStorage.getItem('token'),
    }
  }

  getInitiatives() {
    return this.http.get(this.backend_url + '/initiative', { headers: this.headers }).toPromise();
  }

  getInitiative(initiativeId: number) {
    return this.http.get(this.backend_url + '/initiative/' + initiativeId, { headers: this.headers }).toPromise();
  }

  // roles
  getInitiativeRoles(initiativeId: number) {
    return this.http.get(this.backend_url + '/initiative/' + initiativeId + '/roles', { headers: this.headers }).toPromise();
  }
  
  createNewInitiativeRole(initiativeId: number, role: any) {
    return this.http.post(this.backend_url + '/initiative/' + initiativeId + '/roles', {
      initiative_id: role.initiative_id,
      email: role.email,
      role: role.role,
    }, { headers: this.headers }).toPromise();
  }

  updateInitiativeRole(initiativeId: number, roleId: number, role: any) {
    return this.http.put(this.backend_url + '/initiative/' + initiativeId + '/roles/' + roleId, {
      initiative_id: role.initiative_id,
      id: role.id,
      email: role.email,
      role: role.role,
    }, { headers: this.headers }).toPromise();
  }

  deleteInitiativeRole(initiativeId: number, roleId: number) {
    return this.http.delete(this.backend_url + '/initiative/' + initiativeId + '/roles/' + roleId, { headers: this.headers }).toPromise();
  }

}
