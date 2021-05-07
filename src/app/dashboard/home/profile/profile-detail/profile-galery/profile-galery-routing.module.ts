import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileGalleryComponent } from './profile-galery.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileGalleryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileGalleryRoutingModule {}
