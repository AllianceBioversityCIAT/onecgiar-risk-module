import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = await this.userService.getLogedInUser();
    console.log(user)
    if (!user) {
      this.router.navigate(['/']);
      return false;
    } else {
      if (user.role == 'admin') {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    }
  }
}
