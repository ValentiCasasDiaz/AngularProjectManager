import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.currentUser$.pipe(
    map(user => !!user),
    tap(isLogged => {
      if (!isLogged) {
        router.navigate(['/login']);
      }
    })
  );
  
};
