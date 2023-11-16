import { Injectable, Inject } from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

class UserToken {}
class Permissions {
  constructor(public router: Router) { }
  canActivate(user: UserToken, id?: number): boolean {
    let token = localStorage.getItem('id_token');

    if(!token) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
}

@Injectable()
export class CanActivate {
  constructor(@Inject(Permissions) private permissions: Permissions,
              @Inject(UserToken) private currentUser: UserToken) {}

  canActivate(): (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => boolean {
    return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return this.permissions.canActivate(this.currentUser, route.params.id);
    };
  }
}
