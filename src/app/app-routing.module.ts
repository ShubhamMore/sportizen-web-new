import { UserAuthGuard } from './authentication/auth/guards/user.auth.guard';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginAuthGuard } from './authentication/auth/guards/login.auth.guard';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogDetailsComponent } from './blogs/blog-details/blog-details.component';
import { SaveBlogComponent } from './blogs/save-blog/save-blog.component';
import { MyBlogsComponent } from './blogs/my-blogs/my-blogs.component';

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
        path: 'blogs',
        component: BlogsComponent,
      },
      {
        path: 'blogDetails',
        component: BlogDetailsComponent,
      },
      {
        path: 'saveBlog',
        component: SaveBlogComponent,
      },
      {
        path: 'myBlogs',
        component: MyBlogsComponent,
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
