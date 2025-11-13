import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snack = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ['snack-default']
  };

  private open(message: string, panelClass: string) {
    this.snack.open(message, '', {
      ...this.defaultConfig,
      panelClass: [panelClass]
    });
  }

  success(message: string) {
    this.open(message, 'snack-success');
  }

  error(message: string) {
    this.open(message, 'snack-error');
  }

  info(message: string) {
    this.open(message, 'snack-info');
  }

  warning(message: string) {
    this.open(message, 'snack-warning');
  }

  firebaseAuthErrorMessage(code: string): string {
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
