import { UserAuthGuard } from './authentication/auth/guards/user.auth.guard';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginAuthGuard } from './authentication/auth/guards/login.auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      {
        path: 'home',
        loadChildren: () => import('./content/content.module').then((m) => m.ContentModule),
        canActivate: [LoginAuthGuard],
      },

      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [UserAuthGuard],
      },

      {
        path: 'page-not-found',
        loadChildren: () =>
          import('./@shared/page-not-found/page-not-found.module').then(
            (m) => m.PageNotFoundModule
          ),
      },

      {
        path: ':id',
        loadChildren: () => import('./content/content.module').then((m) => m.ContentModule),
        canActivate: [LoginAuthGuard],
      },

      { path: '**', redirectTo: 'page-not-found' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
