import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { OrdersPage } from './orders.page';

import { OrdersPageRoutingModule } from './orders-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  declarations: [OrdersPage],
})
export class OrdersPageModule {}
