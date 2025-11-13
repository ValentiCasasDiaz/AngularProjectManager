import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  user
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$: Observable<User | null>;

  constructor(
    private auth: Auth,
  ) {
    this.currentUser$ = user(this.auth);
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
