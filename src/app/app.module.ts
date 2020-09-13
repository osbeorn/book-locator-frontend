import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SearchComponent} from './content/search/search.component';

import * as snap from 'snapsvg';
import {JSONService} from './services/json-service';
import {AdminComponent} from './content/admin/admin.component';
import {HomeComponent} from './content/admin/home/home.component';
import {EditComponent} from './content/admin/edit/edit.component';

declare global {
  const Snap: typeof snap;
}

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    AdminComponent,
    HomeComponent,
    EditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    JSONService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
