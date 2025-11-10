import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { merge } from 'rxjs';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { AuthService } from '../../services/auth.service';
import { passwordMatchValidator } from '../../common/validators/password-match.validator';

@Component({
  selector: 'app-register-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {

  emailErrorMsg = signal('');
  hidePwd = signal(true);
  hideRepeatPwd = signal(true);

  loading = signal(false);

  fb: FormBuilder = new FormBuilder();

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    repeatPassword: ['', Validators.required],
  },
    {
      validators: passwordMatchValidator
    });

  constructor(private auth: AuthService, private router: Router) {
    merge(this.registerForm.controls.email.statusChanges, this.registerForm.controls.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMsg());
  }

  updateEmailErrorMsg() {
    if (this.registerForm.controls.email.hasError('required')) {
      this.emailErrorMsg.set('El camp no pot estar buit');
    } else if (this.registerForm.controls.email.hasError('email')) {
      this.emailErrorMsg.set('No és un correu vàlid');
    } else {
      this.emailErrorMsg.set('');
    }
  }

  changePwdVisibility(event: MouseEvent) {
    this.hidePwd.set(!this.hidePwd());
    event.stopPropagation();
  }

  changeRepPwdVisibility(event: MouseEvent) {
    this.hideRepeatPwd.set(!this.hideRepeatPwd());
    event.stopPropagation();
  }

  onSubmit() {
    if (this.registerForm.valid) {

      this.loading.set(true);

      const { email, password } = this.registerForm.value;

      this.auth.register(email!, password!)
        .then(() => this.router.navigate(['/home']))
        .catch(err => console.error('Error registre:', err))
        .finally(() => this.loading.set(false));
    }
  }

}
