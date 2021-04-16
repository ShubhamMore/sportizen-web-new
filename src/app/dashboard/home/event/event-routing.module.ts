import { EventComponent } from './event.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: EventComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./list-event/list-event.module').then((m) => m.ListEventModule),
      },
      {
        path: 'new',
        loadChildren: () => import('./save-event/save-event.module').then((m) => m.SaveEventModule),
      },
      {
        path: 'edit',
        loadChildren: () => import('./save-event/save-event.module').then((m) => m.SaveEventModule),
      },
      {
        path: 'join',
        loadChildren: () => import('./join-event/join-event.module').then((m) => m.JoinEventModule),
      },
      {
        path: 'view',
        loadChildren: () => import('./view-event/view-event.module').then((m) => m.ViewEventModule),
      },
      {
        path: 'manage',
        loadChildren: () =>
          import('./manage-event/manage-event.module').then((m) => m.ManageEventModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
