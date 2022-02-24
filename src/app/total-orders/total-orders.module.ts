import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TotalOrdersPageRoutingModule } from './total-orders-routing.module';
import { MatTableModule } from '@angular/material/table';
import { TotalOrdersPage } from './total-orders.page';
import { TotalordersComponent } from './totalorders/totalorders.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TotalOrdersPageRoutingModule,
    MatTableModule,
    MatIconModule,
  ],
  declarations: [TotalOrdersPage, TotalordersComponent],
})
export class TotalOrdersPageModule {}
