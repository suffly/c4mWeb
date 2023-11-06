import { Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@app/services/authen/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard {
  constructor(
    private router: Router,
    private authenService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenService.currentUserValue;
        let allowedRoles: string[];
        let canAccess: boolean;
        allowedRoles = route.data.allowedRoles;
        if (allowedRoles == null || allowedRoles.length === 0) {
            canAccess = true;
        } else {
            canAccess = allowedRoles.includes(currentUser.role_id.toString());
        }
        if (currentUser && canAccess) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        this.authenService.logout();
        return false;
  }
};
