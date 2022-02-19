import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TotalOrdersPageRoutingModule } from './total-orders-routing.module';

import { TotalOrdersPage } from './total-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TotalOrdersPageRoutingModule
  ],
  declarations: [TotalOrdersPage]
})
export class TotalOrdersPageModule {}
