import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./content/content.module').then((m) => m.ContentModule),
      },

      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
      },

      {
        path: 'event',
        loadChildren: () => import('./../../event/event.module').then((m) => m.EventModule),
      },

      {
        path: 'chat',
        loadChildren: () => import('./chats/chats.module').then((m) => m.ChatsModule),
      },

      {
        path: 'blog',
        loadChildren: () => import('./../../blog/blog.module').then((m) => m.BlogModule),
      },

      {
        path: 'search',
        loadChildren: () =>
          import('./search-user/search-user.module').then((m) => m.SearchUserModule),
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('./../../settings/privacy-policy/privacy-policy.module').then(
            (m) => m.PrivacyPolicyModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
