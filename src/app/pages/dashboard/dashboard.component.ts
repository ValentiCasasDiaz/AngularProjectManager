import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


// Services
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-dashboard',
    imports: [
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

    user$: Observable<User | null> | undefined;
    isHandset$: Observable<boolean> | undefined;

    sidenavOpened = signal(true);

    menuItems = [
        { icon: 'home', label: 'Inici', route: '/dashboard/home' },
        { icon: 'settings', label: 'Configuració', route: '/dashboard/settings' }
    ];

    constructor(
        private auth: AuthService,
        private breakpointObserver: BreakpointObserver,
        private noti: NotificationService,
        public router: Router,
    ) { }

    ngOnInit(): void {
        this.user$ = this.auth.currentUser$;

        // Sets the handset observer
        this.isHandset$ = this.breakpointObserver
            .observe(Breakpoints.Handset)
            .pipe(
                map(result => result.matches),
                shareReplay()
            );
    }

    toggleSidenav() {
        this.sidenavOpened.set(!this.sidenavOpened);
    }

    logout() {
        this.auth.logout()
            .then(() => this.router.navigate(['/login']))
            .catch(err => this.noti.error(this.noti.firebaseAuthErrorMessage(err.code)));
    }

    goProfile() {
        this.router.navigate(['/dashboard/profile']);
    }
}
