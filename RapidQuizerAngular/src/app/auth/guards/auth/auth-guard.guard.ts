import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userRole = this.authService.getUserRole();
    
    if (userRole !== 'ADMIN' && userRole !== 'CONTRIBUTOR' && userRole !== 'USER') {
      this.router.navigate(['/']);
      return false;
    }

    if (route.data['requiresAuth'] && !this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
}