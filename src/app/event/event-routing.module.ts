import { EventComponent } from './event.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAuthGuard } from '../authentication/auth/guards/user.auth.guard';

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
        canLoad: [UserAuthGuard],
        canActivate: [UserAuthGuard],
      },
      {
        path: 'joined',
        loadChildren: () => import('./list-event/list-event.module').then((m) => m.ListEventModule),
        data: { type: 'joined' },
        canLoad: [UserAuthGuard],
        canActivate: [UserAuthGuard],
      },
      {
        path: 'new',
        loadChildren: () => import('./save-event/save-event.module').then((m) => m.SaveEventModule),
        data: { type: 'new' },
        canLoad: [UserAuthGuard],
        canActivate: [UserAuthGuard],
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('./save-event/save-event.module').then((m) => m.SaveEventModule),
        data: { type: 'edit' },
        canLoad: [UserAuthGuard],
        canActivate: [UserAuthGuard],
      },
      {
        path: 'join/:id',
        loadChildren: () => import('./join-event/join-event.module').then((m) => m.JoinEventModule),
        canLoad: [UserAuthGuard],
        canActivate: [UserAuthGuard],
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
