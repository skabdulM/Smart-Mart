import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
@NgModule({
  declarations: [AppComponent, NavBarComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
const app = initializeApp(environment.firebaseConfig);
const analytics = getAnalytics(app);
