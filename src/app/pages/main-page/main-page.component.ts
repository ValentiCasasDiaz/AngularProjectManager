import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Services
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-main-page',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  sidenavOpened = signal(true);

  menuItems = [
    { icon: 'home', label: 'Inici', route: '/home' },
    { icon: 'account_circle', label: 'Perfil', route: '/profile' },
    { icon: 'settings', label: 'Configuració', route: '/settings' }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  toggleSidenav() {
    this.sidenavOpened.set(!this.sidenavOpened());
  }

  logout() {
    this.auth.logout()
    .then(() => this.router.navigate(['/login']))
    .catch(err => console.error('Error logout:', err));
  }

}
