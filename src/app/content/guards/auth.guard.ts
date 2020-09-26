import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    public router: Router,
    public auth: AuthService
  ) {
  }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/', 'login']);
      return false;
    }

    return true;
  }
}
