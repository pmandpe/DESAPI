import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService, AlertService } from '../services';



@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;

        // check if route is restricted by role
        if (currentUser[0]) {
            if (route.data.roles && route.data.roles.indexOf(currentUser[0].role) === -1) {
                // role not authorised so redirect to home page
                this.alertService.error("You donot have permission to this page.");
                //this.router.navigate(['/login']);
                return false;
            }
        }

        if (currentUser) {
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}