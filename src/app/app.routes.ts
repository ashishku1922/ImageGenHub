import { Routes } from '@angular/router';
import { LandingComponent } from './components/components/landing/landing.component';
import { SignupComponent } from './components/components/signup/signup.component';
import { LoginComponent } from './components/components/login/login.component';
import { CreateMemeComponent } from './components/components/create-meme/create-meme.component';
import { DashboardComponent } from './components/components/dashboard/dashboard.component';
import { AuthGuard } from './guards/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create', component: CreateMemeComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];