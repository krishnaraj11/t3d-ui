import { Routes } from '@angular/router';
import { Storefront } from './pages/storefront/storefront';
import { ModelDetail } from './pages/model-detail/model-detail';
import { Upload } from './pages/upload/upload';
import { authGuard } from './auth-guard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Storefront },
  { path: 'model/:id', component: ModelDetail },
  { path: 'upload', component: Upload, canActivate: [authGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile/:username', component: Profile },
];