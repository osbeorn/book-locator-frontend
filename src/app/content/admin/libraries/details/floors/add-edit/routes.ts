import {Route} from '@angular/router';
import {AddEditComponent} from './add-edit.component';

export const route: Route = {
  path: '',
  children: [
    {
      path: 'add',
      component: AddEditComponent
    },
    {
      path: ':floorId/edit',
      component: AddEditComponent
    }
  ]
};
