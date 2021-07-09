import {Route, Routes} from '@angular/router';
import {LibrariesComponent} from './libraries.component';
import {route as listRoute} from './list/routes';
import {route as addEditRoute} from './add-edit/routes';
import {route as detailsRoute} from './details/routes';

const childRoutes: Routes = [
  listRoute,
  addEditRoute,
  detailsRoute
];

export const route: Route = {
  path: 'libraries',
  component: LibrariesComponent,
  children: childRoutes
};
