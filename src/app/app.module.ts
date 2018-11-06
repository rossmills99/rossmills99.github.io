import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { CaptureComponent } from './capture/capture.component';
import { RmVidComponent } from './rm-vid/rm-vid.component';


const appRoutes: Routes = [
  { 
    path: '**',
    component:  CaptureComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    CaptureComponent,
    RmVidComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      //{ enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
