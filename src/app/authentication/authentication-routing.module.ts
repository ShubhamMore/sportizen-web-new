import { AuthenticationComponent } from './authentication.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginAuthActivateGuard } from './auth/guards/login.activate.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },

      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
        canActivate: [LoginAuthActivateGuard],
      },
      {
        path: 'register',
        loadChildren: () => import('./register/register.module').then((m) => m.RegisterModule),
        canActivate: [LoginAuthActivateGuard],
      },
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('./forgot-password/forgot-password.module').then((m) => m.ForgotPasswordModule),
        canActivate: [LoginAuthActivateGuard],
      },
      {
        path: 'reset-password',
        loadChildren: () =>
          import('./reset-password/reset-password.module').then((m) => m.ResetPasswordModule),
        canActivate: [LoginAuthActivateGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
