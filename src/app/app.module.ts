import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SearchComponent} from './content/search/search.component';

import * as snap from 'snapsvg';
import {AdminComponent} from './content/admin/admin.component';
import {DashboardComponent} from './content/admin/dashboard/dashboard.component';
import {LookupService} from './services/lookup.service';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {LibrariesComponent} from './content/admin/libraries/libraries.component';
import {TableModule} from 'primeng/table';
import {LibraryService} from './services/library.service';
import {AddEditComponent as LibraryAddEditComponent} from './content/admin/libraries/add-edit/add-edit.component';
import {ListComponent} from './content/admin/libraries/list/list.component';
import {FormsModule} from '@angular/forms';
import {DetailsComponent as LibraryDetailsComponent} from './content/admin/libraries/details/details.component';
import {FloorsComponent} from './content/admin/libraries/details/floors/floors.component';
import {FloorService} from './services/floor.service';
import {AddEditComponent as FloorAddEditComponent} from './content/admin/libraries/details/floors/add-edit/add-edit.component';
import {ViewComponent} from './content/admin/libraries/details/view/view.component';
import {DetailsComponent as FloorDetailsComponent} from './content/admin/libraries/details/floors/details/details.component';
import {InlineSVGModule} from 'ng-inline-svg';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {LaddaModule} from 'angular2-ladda';
import {SearchService} from './services/search.service';
import {LoginComponent} from './content/login/login.component';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './content/guards/auth.guard';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GravatarModule} from 'ngx-gravatar';
import {PopoverModule} from 'ngx-bootstrap/popover';
import {SidebarToggleDirective} from './content/directives/sidebar-toggle/sidebar-toggle.directive';
import {ScrollToTopDirective} from './content/directives/scroll-to-top/scroll-to-top.directive';
import {StatisticService} from './services/statistic.service';
import {NgxChartsModule} from '@swimlane/ngx-charts';
// import {SearchLogsComponent} from './content/admin/search-logs/search-logs.component';
// import {ListComponent as SearchLogListComponent} from './content/admin/search-logs/list/list.component';
// import {SearchLogService} from './services/search-log.service';
import {UrlSerializer} from '@angular/router';
import CustomUrlSerializer from './utils/custom-url.serializer';

declare global {
  const Snap: typeof snap;
}

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    AdminComponent,
    DashboardComponent,
    LibrariesComponent,
    LibraryAddEditComponent,
    ListComponent,
    LibraryDetailsComponent,
    FloorsComponent,
    FloorAddEditComponent,
    ViewComponent,
    FloorDetailsComponent,
    LoginComponent,

    SidebarToggleDirective,
    ScrollToTopDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,

    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    PopoverModule.forRoot(),
    BrowserAnimationsModule,
    TableModule,
    InlineSVGModule.forRoot({
      baseUrl: ''
    }),
    LaddaModule.forRoot({
      style: 'zoom-out',
      spinnerLines: 12
    }),
    GravatarModule,
    NgxChartsModule
  ],
  providers: [
    AuthGuard,

    {
      provide: UrlSerializer,
      useClass: CustomUrlSerializer
    },

    AuthService,
    FloorService,
    LibraryService,
    LookupService,
    SearchService,
    StatisticService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
