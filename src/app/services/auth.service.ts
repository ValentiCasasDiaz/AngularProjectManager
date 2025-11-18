import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  user
} from '@angular/fire/auth';
import { from, map, switchMap } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$: Observable<User | null>;
  isAdmin$: Observable<boolean>;

  constructor(
    private auth: Auth,
  ) {
    this.currentUser$ = user(this.auth);
    // Expose a boolean observable that emits true when the signed user has the 'admin' custom claim.
    this.isAdmin$ = this.currentUser$.pipe(
      switchMap(u => {
        if (!u) {
          return from([false]);
        }
        // use the user object's getIdTokenResult to read custom claims
        console.log(u.getIdTokenResult());
        
        return from(u.getIdTokenResult()).pipe(map(res => !!(res?.claims as any)?.admin));
      })
    );
  }

  async login(email: string, password: string): Promise<User | void> {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      return cred.user;

    } catch (err: any) {
      throw err;
    }
  }

  async register(email: string, password: string): Promise<User | void> {
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);
      return cred.user;

    } catch (err: any) {
      throw err;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } 
    catch (err: any) {
      throw err;
    }
  }

}
