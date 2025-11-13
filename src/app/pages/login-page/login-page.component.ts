import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {

  emailErrorMsg = signal('');
  hidePwd = signal(true);

  loading = signal(false);

  fb: FormBuilder = new FormBuilder();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private auth: AuthService,
    private router: Router,
    private userService: UserService,
    private noti: NotificationService) 
  {
    merge(this.loginForm.controls.email.statusChanges, this.loginForm.controls.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMsg());
  }

  updateEmailErrorMsg() {
    if (this.loginForm.controls.email.hasError('required')) {
      this.emailErrorMsg.set('El camp no pot estar buit');
    } else if (this.loginForm.controls.email.hasError('email')) {
      this.emailErrorMsg.set('No és un correu vàlid');
    } else {
      this.emailErrorMsg.set('');
    }
  }

  changePwdVisibility(event: MouseEvent) {
    this.hidePwd.set(!this.hidePwd());
    event.stopPropagation();
  }

  onSubmit() {
    if (this.loginForm.valid) {

      this.loading.set(true);

      const { email, password } = this.loginForm.value;

      this.auth.login(email!, password!)
        .then(() => this.router.navigate(['/main']))
        .catch(err => this.noti.error(this.noti.firebaseAuthErrorMessage(err.code)))
        .finally(() => this.loading.set(false));
    }
  }

  async forgotPassword() {
    const email = this.loginForm.value.email as string;
    if (!email) {
      this.noti.error('Introdueix el correu per rebre l\'enllaç de recuperació');
      return;
    }

    this.loading.set(true);

    try {
      await this.userService.sendPasswordReset(email);
      this.noti.success('S\'ha enviat un correu per restablir la contrasenya');
    } catch (err: any) {
      this.noti.error(err?.message || 'Error enviant el correu de recuperació');
    } finally {
      this.loading.set(false);
    }
  }
}
