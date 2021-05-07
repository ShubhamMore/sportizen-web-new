import { ProfileDetailComponent } from './profile-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ProfileDetailComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./profile-dashboard/profile-dashboard.module').then(
            (m) => m.ProfileDashboardModule
          ),
      },

      {
        path: 'gallery',
        loadChildren: () =>
          import('./profile-galery/profile-galery.module').then((m) => m.ProfileGalleryModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileDetailRoutingModule {}
