import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductsPageRoutingModule } from './products-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductsPage } from './products.page';
import { QRCodeModule } from 'angularx-qrcode';
import { AddProductDailogComponent } from './add-product-dailog/add-product-dailog.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    QRCodeModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule
    // AddProductDailogComponent
  ],
  declarations: [ProductsPage,AddProductDailogComponent],
})
export class ProductsPageModule {}
