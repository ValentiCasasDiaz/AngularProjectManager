import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  user
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private snack = inject(MatSnackBar);

  currentUser$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.currentUser$ = user(this.auth);
  }

  async login(email: string, password: string): Promise<User | void> {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      return cred.user;

    } catch (err: any) {
      this.showError(err);
      throw err;
    }
  }

  async register(email: string, password: string): Promise<User | void> {
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);
      return cred.user;

    } catch (err: any) {
      this.showError(err);
      throw err;
    }
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  private showError(error: any) {
    const message = this.firebaseErrorMessage(error.code);
    this.snack.open(message, 'Tancar', {
      duration: 4000,
      panelClass: ['mat-elevation-z4']
    });
  }

  private firebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Aquest email ja està registrat.';
      case 'auth/invalid-credential':
        return 'L\'usuari o la contrassenya no són correctes';
      case 'auth/invalid-email':
        return 'Email invàlid.';
      case 'auth/user-not-found':
        return 'Aquest usuari no existeix.';
      case 'auth/wrong-password':
        return 'Contrasenya incorrecta.';
      case 'auth/weak-password':
        return 'La contrasenya és massa feble.';
      default:
        return 'S\'ha produït un error inesperat.';
    }
  }
}
