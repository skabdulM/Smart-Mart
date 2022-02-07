import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddProductDailogComponent } from './add-product-dailog/add-product-dailog.component';
// import { QRCodeElementType, QRCodeErrorCorrectionLevel } from 'angularx-qrcode';
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.css'],
})
export class ProductsPage implements OnInit {
  constructor(public dialog: MatDialog) {}
  products: any = [];
  ngOnInit() {}

  openDialog() {
    const dialogRef = this.dialog.open(AddProductDailogComponent, {
      width: '650px',
      // data: note,
    });
    dialogRef.afterClosed().subscribe((addProduct) => {
      if (addProduct.redirect === 'close') {
        console.log(addProduct.redirect);
      } else {
        const product = {
          productId: addProduct.productId,
          productName: addProduct.productName,
          productDescription: addProduct.productDescription,
          productImage: addProduct.productImage,
        };
        this.products.push(product);
      }
    });
  }
}
