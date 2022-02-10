import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { initializeApp } from 'firebase/app';
import {
  collection,
  getFirestore,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { AddProductDailogComponent } from './add-product-dailog/add-product-dailog.component';
// import { QRCodeElementType, QRCodeErrorCorrectionLevel } from 'angularx-qrcode';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Product {
  id?: string;
  productId?: any;
  productName?: string;
  productDescription?: string;
  productPrice?: number;
  productImage?: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.css'],
})
export class ProductsPage implements OnInit {
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {}
  products: any = [];
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore();
  dataSource = this.products;
  displayedColumns: string[] = [
    'productName',
    'productDescription',
    'productPrice',
  ];

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    const docRef = collection(this.db, 'products');
    const OrderBy = query(docRef, orderBy('productName', 'asc'));
    onSnapshot(OrderBy, (snapshot) => {
      this.products = [];
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id });
      });
      console.log(this.products);
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 2500 });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddProductDailogComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe((addProduct) => {
      if (addProduct.redirect === 'save') {
        const db = getFirestore();
        const docRef = collection(db, 'products');
        addDoc(docRef, {
          productId: addProduct.productId,
          productName: addProduct.productName,
          productDescription: addProduct.productDescription,
          productPrice: addProduct.productAmount,
          productImage: addProduct.productImage,
        }).then(() => {
          this.openSnackBar('Product Added!! 👏👏 ', 'Ok');
        });
      } else {
        console.log('Something is Fishy 🐟🐟');
      }
    });
  }

  deleteProduct(id: string) {
    const docRef = doc(this.db, 'products', id);
    deleteDoc(docRef).then(() => {
      this.openSnackBar('Product Deleted 😞😞 !!', 'Ok');
    });
  }
}
