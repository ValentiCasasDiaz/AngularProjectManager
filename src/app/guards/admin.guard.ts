import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private firestore: Firestore) {}

  async canActivate(): Promise<boolean | UrlTree> {
    try {
      // Check Firestore users/{uid}.roles.admin
      const user = await firstValueFrom(this.auth.currentUser$);
      if (!user) return this.router.parseUrl('/login');

      const ref = doc(this.firestore, `users/${user.uid}`);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as any;
        
        if (data?.roles?.admin) 
            return true;
      }

      return this.router.parseUrl('/dashboard');
    } catch (err) {
      return this.router.parseUrl('/dashboard');
    }
  }
}
