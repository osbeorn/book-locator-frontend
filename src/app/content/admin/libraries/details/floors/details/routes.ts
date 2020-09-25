import {Route} from '@angular/router';
import {DetailsComponent} from './details.component';

export const route: Route = {
  path: ':floorId',
  component: DetailsComponent
};
