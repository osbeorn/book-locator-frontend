import {Route, Routes} from '@angular/router';
import {DetailsComponent} from './details.component';
import {route as viewRoute} from './view/routes';
import {route as floorRoutes} from './floors/routes';

const childRoutes: Routes = [
  viewRoute,
  floorRoutes,
];

export const route: Route = {
  path: ':libraryId',
  component: DetailsComponent,
  children: childRoutes
};
