import {Route, Routes} from '@angular/router';
import {route as dashboardRoute} from './dashboard/routes';
import {route as librariesRoute} from './libraries/routes';
import {AdminComponent} from './admin.component';
import {AuthGuard} from '../guards/auth.guard';

const childRoutes: Routes = [
  dashboardRoute,
  librariesRoute
];

export const route: Route = {
  path: 'admin',
  component: AdminComponent,
  children: childRoutes,
  canActivate: [
    AuthGuard
  ]
};
