import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductsPageRoutingModule } from './products-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductsPage } from './products.page';
import { QRCodeModule } from 'angularx-qrcode';
import { AddProductDailogComponent } from './add-product-dailog/add-product-dailog.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    QRCodeModule,
    MatDialogModule,
    // AddProductDailogComponent
  ],
  declarations: [ProductsPage,AddProductDailogComponent],
})
export class ProductsPageModule {}
