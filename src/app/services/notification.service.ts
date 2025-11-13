import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snack = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    duration: 20000,
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
}
