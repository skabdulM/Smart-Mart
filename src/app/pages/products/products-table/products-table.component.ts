import { Component, OnInit } from '@angular/core';
import { Products } from 'src/app/products';
import { initializeApp } from 'firebase/app';
import {
  collection,
  getFirestore,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditProductdailogComponent } from '../edit-productdailog/edit-productdailog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.css'],
})
export class ProductsTableComponent implements OnInit {
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {}
  products: Products[] = [];
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore();
  displayedColumns = [
    'srNo',
    'productName',
    'productDescription',
    'productPrice',
    'editProduct',
    'deleteProduct',
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
    });
  }

  editProduct(product: Products) {
    const dialogRef = this.dialog.open(EditProductdailogComponent, {
      width: '650px',
      data: product,
    });
    dialogRef.afterClosed().subscribe((addProduct) => {
      if (addProduct.redirect === 'update') {
        const docRef = doc(this.db, 'products', addProduct.productId);
        updateDoc(docRef, {
          productName: addProduct.productName,
          productDescription: addProduct.productDescription,
          productImage: addProduct.productImage,
          productPrice: addProduct.productAmount,
        }).then(() => {
          this.openSnackBar('Updated!! 👏👏 ', 'Ok');
        });
      } else {
        this.openSnackBar('Nothing changed', '🆗');
      }
    });
  }

  deleteProduct(id: string) {
    const docRef = doc(this.db, 'products', id);
    deleteDoc(docRef).then(() => {
      this.openSnackBar('Product Deleted 😞😞 !!', 'Ok');
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 2500 });
  }
}
