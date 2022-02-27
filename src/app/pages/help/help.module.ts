import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HelpPageRoutingModule } from './help-routing.module';

import { HelpPage } from './help.page';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpPageRoutingModule,
    SwiperModule,
  ],
  declarations: [HelpPage],
})
export class HelpPageModule {}
