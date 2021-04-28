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
        canLoad: [UserAuthGuard],
      },

      {
        path: 'events',
        loadChildren: () => import('./event/event.module').then((m) => m.EventModule),
        canActivate: [LoginAuthGuard],
      },

      {
        path: 'blogs',
        loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule),
        canActivate: [LoginAuthGuard],
      },

      {
        path: 'post/:id',
        loadChildren: () => import('./post/post.module').then((m) => m.PostModule),
        canActivate: [LoginAuthGuard],
      },
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
