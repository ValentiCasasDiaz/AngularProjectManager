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
      this.showMessage(err);
      throw err;
    }
  }

  async register(email: string, password: string): Promise<User | void> {
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);
      return cred.user;

    } catch (err: any) {
      this.showMessage(err);
      throw err;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.showMessage('Sessió tancada correctament');
    } 
    catch (err: any) {
      this.showMessage(err);
      throw err;
    }
  }

  private showMessage(error: any) {
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
        return 'La contrasenya hauria de tenir almenys 6 caràcters';
      default:
        return 'S\'ha produït un error inesperat.';
    }
  }
}
