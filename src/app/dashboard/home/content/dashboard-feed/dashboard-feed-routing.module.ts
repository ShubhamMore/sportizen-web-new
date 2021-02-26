import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardFeedComponent } from './dashboard-feed.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: DashboardFeedComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardFeedRoutingModule {}
