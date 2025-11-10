import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';

// Angular Fire imports
import { AuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
const redirectUnauthorized = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedUser = () => redirectLoggedInTo(['/main']);

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPageComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectLoggedUser } },
    { path: 'register', component: RegisterPageComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectLoggedUser } },
    { path: 'main', component: MainPageComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorized } },
    { path: '**', redirectTo: 'home' }
];
