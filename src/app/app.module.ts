import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { NavBarComponent } from './nav-bar/nav-bar.component';
// import { NavBarModule } from './nav-bar/nav-bar.module';
// import { HomePageModule } from './home/home.module';

@NgModule({
  declarations: [AppComponent,NavBarComponent],
  imports: [
    BrowserModule,
    // HomePageModule,
    IonicModule.forRoot(),
    // NavBarModule,
    AppRoutingModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
