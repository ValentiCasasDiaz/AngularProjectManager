import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { AuthService } from '../../services/auth.service';


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
    MatProgressSpinnerModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  hidePassword = true;
  loading = false;

  fb: FormBuilder = new FormBuilder();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    if (this.loginForm.valid) {

      this.loading = true;

      const { email, password } = this.loginForm.value;

      this.auth.login(email!, password!)
      .then(() => this.router.navigate(['/home']))
      .catch(err => console.error('Error login:', err))
      .finally(() => this.loading = false);
    }
  }

}
