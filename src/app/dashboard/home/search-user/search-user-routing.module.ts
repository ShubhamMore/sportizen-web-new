import { SearchUserComponent } from './search-user.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SearchUserComponent,
    children: [
      {
        path: ':searchKeyword',
        loadChildren: () => import('./all-users/all-users.module').then((m) => m.AllUsersModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchUserRoutingModule {}
