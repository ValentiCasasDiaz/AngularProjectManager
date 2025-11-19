import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  user
} from '@angular/fire/auth';
import { Observable, from, switchMap, map } from 'rxjs';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$: Observable<User | null>;
  isAdmin$: Observable<boolean>;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.currentUser$ = user(this.auth);

    // Expose an observable that returns true when the Firestore user document has roles.admin === true.
    this.isAdmin$ = this.currentUser$.pipe(
      switchMap(u => {
        
        if (!u) { 
          return from([false]);
        }
        
        return from(u.getIdTokenResult()).pipe(
          switchMap(res => {
            const ref = doc(this.firestore, `users/${u.uid}`);
            return from(getDoc(ref)).pipe(map(snap => !!(snap.exists() && ((snap.data() as any)?.roles?.admin))));
          })
        );
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
