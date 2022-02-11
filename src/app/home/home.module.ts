import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ZXingScannerModule } from 'angular-weblineindia-qrcode-scanner';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ZXingScannerModule
    
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
