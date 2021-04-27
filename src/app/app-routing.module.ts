import { UserAuthActivateGuard } from './authentication/auth/guards/user.activate.guard';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginAuthActivateGuard } from './authentication/auth/guards/login.activate.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      {
        path: 'home',
        loadChildren: () => import('./content/content.module').then((m) => m.ContentModule),
        canActivate: [LoginAuthActivateGuard],
      },

      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [UserAuthActivateGuard],
      },

      {
        path: 'events',
        loadChildren: () => import('./event/event.module').then((m) => m.EventModule),
        canActivate: [LoginAuthActivateGuard],
      },

      {
        path: 'page-not-found',
        loadChildren: () =>
          import('./@shared/page-not-found/page-not-found.module').then(
            (m) => m.PageNotFoundModule
          ),
      },

      { path: '**', redirectTo: 'page-not-found' },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      useHash: true,
      // enableTracing: false,
      // scrollPositionRestoration: 'enabled',
      // anchorScrolling: 'enabled',
      // scrollOffset: [0, 64], // [x, y]
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
