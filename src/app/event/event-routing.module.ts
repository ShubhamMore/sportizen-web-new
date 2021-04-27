import { EventComponent } from './event.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAuthActivateGuard } from './../authentication/auth/guards/user.activate.guard';

const routes: Routes = [
  {
    path: '',
    component: EventComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./list-event/list-event.module').then((m) => m.ListEventModule),
        data: { type: 'list' },
      },
      {
        path: 'manage',
        loadChildren: () => import('./list-event/list-event.module').then((m) => m.ListEventModule),
        data: { type: 'manage' },
        canActivate: [UserAuthActivateGuard],
      },
      {
        path: 'joined',
        loadChildren: () => import('./list-event/list-event.module').then((m) => m.ListEventModule),
        data: { type: 'joined' },
        canActivate: [UserAuthActivateGuard],
      },
      {
        path: 'new',
        loadChildren: () => import('./save-event/save-event.module').then((m) => m.SaveEventModule),
        data: { type: 'new' },
        canActivate: [UserAuthActivateGuard],
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('./save-event/save-event.module').then((m) => m.SaveEventModule),
        data: { type: 'edit' },
        canActivate: [UserAuthActivateGuard],
      },
      {
        path: 'join/:id',
        loadChildren: () => import('./join-event/join-event.module').then((m) => m.JoinEventModule),
        canActivate: [UserAuthActivateGuard],
      },
      {
        path: 'view/:id',
        loadChildren: () => import('./view-event/view-event.module').then((m) => m.ViewEventModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
