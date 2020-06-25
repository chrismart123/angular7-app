import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ApiService } from '../_api';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private apiService: ApiService) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const currentUser = this.apiService.currentUserValue;
		if (currentUser) {
			// authorised so return true
			return true;
		}

		// not logged in so redirect to login page with the return url
		this.router.navigate([ '/login' ], { queryParams: { returnUrl: state.url } });
		return false;
	}
}
