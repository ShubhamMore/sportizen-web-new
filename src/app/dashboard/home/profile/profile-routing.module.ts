import { ProfileComponent } from './profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./profile-detail/profile-detail.module').then((m) => m.ProfileDetailModule),
      },

      {
        path: 'edit',
        loadChildren: () =>
          import('./save-profile/save-profile.module').then((m) => m.SaveProfileModule),
      },

      {
        path: ':id',
        loadChildren: () =>
          import('./profile-detail/profile-detail.module').then((m) => m.ProfileDetailModule),
        // import('./user-profile/user-profile.module').then((m) => m.UserProfileModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
