import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {route as loginRoute} from './content/login/routes';
import {route as adminRoute} from './content/admin/routes';
import {route as searchRoute} from './content/search/routes';

const routes: Routes = [
  loginRoute,
  adminRoute,
  searchRoute,
  {
    path: '',
    redirectTo: 'search', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {paramsInheritanceStrategy: 'always'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
