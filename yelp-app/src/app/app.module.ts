import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms' ;
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { ExplorePageComponent } from './explore-page/explore-page.component';
import { LasvegasComponent } from './overview-page/lasvegas/lasvegas.component';
import { CoxcombComponent } from './explore-page/coxcomb/coxcomb.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    OverviewPageComponent,
    ExplorePageComponent,
    LasvegasComponent,
    CoxcombComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
