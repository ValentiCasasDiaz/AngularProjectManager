import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';


// Angular Fire imports
import { AuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { AdminGuard } from './guards/admin.guard';
const redirectUnauthorized = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedUser = () => redirectLoggedInTo(['/dashboard']);

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login', title: 'Login',
        component: LoginPageComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedUser }
    },
    {
        path: 'register', title: 'Register',
        component: RegisterPageComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedUser }
    },
    {
        path: 'dashboard', title: 'Dashboard',
        component: DashboardPageComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorized },
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', title: 'Home', component: MainPageComponent },
            { path: 'profile', title: 'Perfil', loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent) }
            ,{ path: 'users', title: 'Usuaris', loadComponent: () => import('./pages/users/users-page.component').then(m => m.UsersPageComponent), canActivate: [AdminGuard] }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];
