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
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ProductsTableComponent } from './products-table/products-table.component';
import { EditProductdailogComponent } from './edit-productdailog/edit-productdailog.component';

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
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  declarations: [
    ProductsPage,
    ProductsTableComponent,
    AddProductDailogComponent,
    EditProductdailogComponent,
  ],
})
export class ProductsPageModule {}
