import {Route, Routes} from '@angular/router';
import {SearchLogsComponent} from './search-logs.component';
import {route as listRoute} from './list/routes';

const childRoutes: Routes = [
  listRoute
];

export const route: Route = {
  path: 'search-logs',
  component: SearchLogsComponent,
  children: childRoutes
};
