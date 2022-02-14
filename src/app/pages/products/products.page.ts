import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, addDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { AddProductDailogComponent } from './add-product-dailog/add-product-dailog.component';
// import { QRCodeElementType, QRCodeErrorCorrectionLevel } from 'angularx-qrcode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Products } from 'src/app/products';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.css'],
})
export class ProductsPage implements OnInit {
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {}
  products: Products[] = [];
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore();
  ngOnInit() {}

  openDialog() {
    const dialogRef = this.dialog.open(AddProductDailogComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe((addProduct) => {
      if (addProduct.redirect === 'save') {
        const db = getFirestore();
        const docRef = collection(db, 'products');
        addDoc(docRef, {
          productName: addProduct.productName,
          productDescription: addProduct.productDescription,
          productPrice: addProduct.productAmount,
          productImage: addProduct.productImage,
        }).then(() => {
          this.openSnackBar('Product Added!! 👏👏 ', 'Ok');
        });
      } else {
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 2500 });
  }
}
