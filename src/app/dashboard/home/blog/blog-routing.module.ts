import { BlogComponent } from './blog.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./blog-list/blog-list.module').then((m) => m.BlogListModule),
      },
      {
        path: 'new',
        loadChildren: () =>
          import('./create-blog/create-blog.module').then((m) => m.CreateBlogModule),
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('./create-blog/create-blog.module').then((m) => m.CreateBlogModule),
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
