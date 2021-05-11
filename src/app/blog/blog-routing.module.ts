import { BlogComponent } from './blog.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthGuard } from '../authentication/auth/guards/user.auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./blog-list/blog-list.module').then((m) => m.BlogListModule),
        data: { type: 'list' },
      },
      {
        path: 'new',
        loadChildren: () =>
          import('./create-blog/create-blog.module').then((m) => m.CreateBlogModule),
        data: { type: 'new' },
        canActivate: [UserAuthGuard],
        canLoad: [UserAuthGuard],
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('./create-blog/create-blog.module').then((m) => m.CreateBlogModule),
        data: { type: 'edit' },
        canActivate: [UserAuthGuard],
        canLoad: [UserAuthGuard],
      },
      {
        path: 'view/:id',
        loadChildren: () => import('./view-blog/view-blog.module').then((m) => m.ViewBlogModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
