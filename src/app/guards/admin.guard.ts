import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    try {
      const isAdmin = await firstValueFrom(this.auth.isAdmin$);
      if (isAdmin) return true;
      return this.router.parseUrl('/dashboard');
    } catch (err) {
      return this.router.parseUrl('/dashboard');
    }
  }
}
