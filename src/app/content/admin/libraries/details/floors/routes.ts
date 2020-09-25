import {Route, Routes} from '@angular/router';
import {route as addEditRoute} from './add-edit/routes';
import {route as detailsRoute} from './details/routes';
import {FloorsComponent} from './floors.component';

const childRoutes: Routes = [
  addEditRoute,
  detailsRoute
];

export const route: Route = {
  path: 'floors',
  component: FloorsComponent,
  children: childRoutes
};
