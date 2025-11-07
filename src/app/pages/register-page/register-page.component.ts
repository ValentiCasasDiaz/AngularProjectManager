import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { AuthService } from '../../services/auth.service';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {

  loading = false;

  fb: FormBuilder = new FormBuilder();

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    repeatPassword: ['', Validators.required],
  });

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    if (this.registerForm.valid) {
      
      this.loading = true;

      const { email, password } = this.registerForm.value;

      this.auth.register(email!, password!)
        .then(() => this.router.navigate(['/home']))
        .catch(err => console.error('Error registre:', err))
        .finally(() => this.loading = false);
    }
  }

}
