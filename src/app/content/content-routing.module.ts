import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAuthGuard } from '../authentication/auth/guards/login.auth.guard';
import { UserAuthGuard } from './../authentication/auth/guards/user.auth.guard';
import { ContentComponent } from './content.component';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./../authentication/authentication.module').then((m) => m.AuthenticationModule),
        canActivate: [LoginAuthGuard],
      },

      {
        path: 'events',
        loadChildren: () => import('./../event/event.module').then((m) => m.EventModule),
        canActivate: [LoginAuthGuard],
      },

      {
        path: 'blogs',
        loadChildren: () => import('./../blog/blog.module').then((m) => m.BlogModule),
        canActivate: [LoginAuthGuard],
      },

      {
        path: 'post/:id',
        loadChildren: () => import('./../post/post.module').then((m) => m.PostModule),
        canActivate: [LoginAuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentRoutingModule {}
